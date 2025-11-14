import express, { Request, Response } from 'express';
import { vippsService, OrderLine, CreateCheckoutSessionRequest } from '../services/vippsService.js';
import { vippsEPaymentService, CaptureRequest, RefundRequest } from '../services/vippsEPaymentService.js';
import { products } from '../data/products.js';
import { mailService } from '../services/mailService.js';
import { databaseService } from '../services/databaseService.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Check if database is available (fallback to in-memory for development)
const USE_DATABASE = !!process.env.DATABASE_URL;

// Environment variables
const VIPPS_CALLBACK_URL = process.env.VIPPS_CALLBACK_URL || 'http://localhost:3001/api/vipps/callback';
const VIPPS_CALLBACK_AUTHORIZATION_TOKEN = process.env.VIPPS_CALLBACK_AUTHORIZATION_TOKEN;
const VIPPS_MSN = process.env.VIPPS_MSN;
// Frontend URL - can be set via env or defaults to localhost
// In production, should be set to https://mollerfan.club
const FRONTEND_URL = process.env.FRONTEND_URL
    || (process.env.VITE_API_URL && process.env.VITE_API_URL.startsWith('http') ? process.env.VITE_API_URL.replace('/api', '') : null)
    || (process.env.NODE_ENV === 'production' ? 'https://mollerfan.club' : 'http://localhost:5173');

// Validate required environment variables on startup
if (!VIPPS_MSN) {
    console.error('❌ VIPPS_MSN environment variable is required');
}
if (!VIPPS_CALLBACK_AUTHORIZATION_TOKEN) {
    console.warn('⚠️  VIPPS_CALLBACK_AUTHORIZATION_TOKEN not set - callbacks will not be secured');
}

// Helper: Convert cart items to Vipps order lines
function convertCartItemsToOrderLines(cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    size?: string;
}>, baseUrl: string = ''): OrderLine[] {
    return cartItems.map(item => {
        const unitPrice = item.price;
        const quantity = item.quantity;
        const totalAmountExcludingTax = unitPrice * quantity;
        const taxPercentage = 0;
        const totalTaxAmount = totalAmountExcludingTax * (taxPercentage / 100);
        const totalAmount = totalAmountExcludingTax + totalTaxAmount;

        // Build product name with size if applicable
        const productName = item.size ? `${item.name} - ${item.size}` : item.name;

        const orderLine: OrderLine = {
            name: productName,
            id: `${item.id}-${item.size || 'default'}`,
            totalAmount: Math.round(totalAmount * 100), // Convert to øre (cents)
            totalAmountExcludingTax: Math.round(totalAmountExcludingTax * 100),
            totalTaxAmount: Math.round(totalTaxAmount * 100),
            taxPercentage,
            unitInfo: {
                unitPrice: Math.round(unitPrice * 100),
                quantity: String(Math.round(quantity)), // Vipps API expects quantity as string
                quantityUnit: 'pcs',
            },
            isReturn: false,
            isShipping: false,
        };

        // Add optional fields only if they exist
        // Note: ProductUrl must be a valid HTTPS URL (Vipps doesn't accept localhost HTTP URLs)
        // Only include productUrl if it's HTTPS
        if (baseUrl && baseUrl.startsWith('https://')) {
            orderLine.productUrl = `${baseUrl}/merch/${item.id}`;
        }
        // For localhost/development, skip productUrl to avoid validation errors
        if (item.image) {
            orderLine.imageUrl = item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`;
        }

        return orderLine;
    });
}

// Helper: Calculate total amount from order lines
function calculateTotalAmount(orderLines: OrderLine[]): number {
    return orderLines.reduce((sum, line) => sum + line.totalAmount, 0);
}

// Helper: Generate unique reference ID
function generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MF-${timestamp}-${random}`;
}

// Helper: Generate payment description from cart items
function generatePaymentDescription(items: Array<{
    name: string;
    quantity: number;
    size?: string;
}>): string {
    const MAX_DESCRIPTION_LENGTH = 100; // Vipps typically allows up to 100 characters
    
    if (items.length === 0) {
        return 'Møller Fanclub';
    }

    // Calculate total quantity
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    // For single item with quantity 1, show just the name
    if (items.length === 1 && items[0].quantity === 1) {
        const itemName = items[0].size 
            ? `${items[0].name} (${items[0].size})`
            : items[0].name;
        return `Møller Fanclub - ${itemName}`;
    }

    // For single item with multiple quantity
    if (items.length === 1) {
        const itemName = items[0].size 
            ? `${items[0].name} (${items[0].size})`
            : items[0].name;
        return `Møller Fanclub - ${items[0].quantity}x ${itemName}`;
    }

    // For multiple items, create a summary
    // Build list of unique item names (with sizes)
    const itemNames: string[] = [];
    for (const item of items) {
        const itemName = item.size 
            ? `${item.name} (${item.size})`
            : item.name;
        
        // Add quantity prefix if more than 1
        const displayName = item.quantity > 1 
            ? `${item.quantity}x ${itemName}`
            : itemName;
        
        itemNames.push(displayName);
    }

    // Try to fit all items in description
    let description = `Møller Fanclub - ${itemNames.join(', ')}`;
    
    // If too long, show first item(s) and count
    if (description.length > MAX_DESCRIPTION_LENGTH) {
        // Try with first 2 items
        if (itemNames.length >= 2) {
            const twoItems = `${itemNames[0]}, ${itemNames[1]}`;
            const remaining = totalQuantity - (items[0].quantity + items[1].quantity);
            if (remaining > 0) {
                description = `Møller Fanclub - ${twoItems} + ${remaining} mer`;
            } else {
                description = `Møller Fanclub - ${twoItems}`;
            }
        } else {
            // Just show first item and count
            const remaining = totalQuantity - items[0].quantity;
            if (remaining > 0) {
                description = `Møller Fanclub - ${itemNames[0]} + ${remaining} mer`;
            } else {
                description = `Møller Fanclub - ${itemNames[0]}`;
            }
        }
        
        // If still too long, truncate intelligently
        if (description.length > MAX_DESCRIPTION_LENGTH) {
            description = `Møller Fanclub - ${totalQuantity} produkt(er)`;
        }
    }

    return description;
}

/**
 * POST /api/vipps/checkout/session
 * Create a new checkout session
 */
router.post('/checkout/session', async (req: Request, res: Response) => {
    try {
        const { items, customerInfo } = req.body;

        // Validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Cart items are required',
            });
        }

        // Validate items against product catalog
        const validatedItems: any[] = [];
        for (const item of items) {
            const product = products.find(p => p.id === item.id);
            if (!product) {
                return res.status(400).json({
                    error: 'Invalid request',
                    message: `Product ${item.id} not found`,
                });
            }
            // Validate price (allow small tolerance for rounding)
            const expectedPrice = parseFloat(product.price);
            if (Math.abs(item.price - expectedPrice) > 0.01) {
                return res.status(400).json({
                    error: 'Invalid request',
                    message: `Price mismatch for product ${item.id}`,
                });
            }
            validatedItems.push(item);
        }

        // Convert cart items to Vipps order lines
        const orderLines = convertCartItemsToOrderLines(validatedItems, FRONTEND_URL);

        // Calculate total amount
        const totalAmount = calculateTotalAmount(orderLines);

        // Generate unique reference
        const reference = generateReference();

        // Store order data in database (as PENDING) when session is created
        // This ensures we have the order items even if the callback fails
        if (USE_DATABASE) {
            try {
                // Calculate totals
                const itemsTotal = validatedItems.reduce((sum, item) => sum + (item.price * item.quantity * 100), 0); // Convert to øre
                const shippingPrice = 7900; // 79 kr in øre
                const totalAmount = itemsTotal + shippingPrice;

                await databaseService.createOrder({
                    reference,
                    customerEmail: customerInfo?.email || 'pending@example.com', // Will be updated in callback
                    customerName: customerInfo?.name || 'Pending',
                    customerPhone: customerInfo?.phoneNumber,
                    items: validatedItems.map(item => {
                        const unitPrice = Math.round(item.price * 100); // Convert to øre
                        const quantity = item.quantity;
                        const totalPrice = unitPrice * quantity;
                        const taxAmount = Math.round(totalPrice * 0);
                        const product = products.find(p => p.id === item.id);

                        return {
                            productId: item.id,
                            productName: item.name,
                            productImage: item.image || product?.imageUrls?.[0],
                            size: item.size,
                            unitPrice,
                            quantity,
                            totalPrice,
                            taxAmount,
                        };
                    }),
                    itemsTotal,
                    shippingPrice,
                    totalAmount,
                    amount: totalAmount,
                    currency: 'NOK',
                });
            } catch (dbError) {
                console.error(`⚠️ Failed to create order in database for ${reference}:`, dbError);
                // Continue anyway - order will be created in callback if payment succeeds
            }
        }

        // Validate required environment variables
        if (!VIPPS_MSN) {
            throw new Error('VIPPS_MSN environment variable is not set');
        }

        // Build callback URL (full URL, not prefix)
        // Vipps requires HTTPS URLs (use ngrok or similar for local development)
        const callbackUrl = VIPPS_CALLBACK_URL;
        
        // Validate callback URL format
        if (!callbackUrl.startsWith('https://') && !callbackUrl.startsWith('http://localhost')) {
            console.warn('⚠️  Callback URL should be HTTPS for production. For local development, use ngrok or similar.');
        }

        // Create session request according to Vipps Checkout API v3 format
        const merchantInfo: CreateCheckoutSessionRequest['merchantInfo'] = {
            callbackUrl,
            returnUrl: `${FRONTEND_URL}/checkout/success?reference=${reference}`,
        };

        // Add callbackAuthorizationToken if available (optional but recommended)
        if (VIPPS_CALLBACK_AUTHORIZATION_TOKEN) {
            merchantInfo.callbackAuthorizationToken = VIPPS_CALLBACK_AUTHORIZATION_TOKEN;
        } else {
            console.warn('⚠️  VIPPS_CALLBACK_AUTHORIZATION_TOKEN not set - callbacks will not be secured');
        }

        // Calculate bottom line (total amount)
        // Note: Vipps API expects 'orderBottomLine' (camelCase), not 'bottomLine'
        const orderBottomLine = {
            currency: 'NOK',
            amount: totalAmount,
        };

        // Generate descriptive payment description
        const paymentDescription = generatePaymentDescription(validatedItems);

        const sessionRequest: CreateCheckoutSessionRequest = {
            type: 'PAYMENT',
            reference,
            transaction: {
                amount: {
                    currency: 'NOK',
                    value: totalAmount, // Amount in øre
                },
                reference,
                paymentDescription,
                orderSummary: {
                    orderLines,
                    orderBottomLine,
                },
            },
            merchantInfo,
            configuration: {
                elements: 'PaymentAndContactInfo', // We need address for shipping
            },
        };

        // Add customer info if provided (for prefill)
        if (customerInfo?.email || customerInfo?.phoneNumber) {
            sessionRequest.prefillCustomer = {};
            if (customerInfo.email) {
                sessionRequest.prefillCustomer.email = customerInfo.email;
            }
            if (customerInfo.phoneNumber) {
                sessionRequest.prefillCustomer.phoneNumber = customerInfo.phoneNumber;
            }
        }

        // Create session
        const session = await vippsService.createCheckoutSession(sessionRequest);

        // Return session data to frontend
        return res.json({
            success: true,
            reference,
            token: session.token,
            checkoutFrontendUrl: session.checkoutFrontendUrl,
            pollingUrl: session.pollingUrl,
        });
    } catch (error) {
        console.error('❌ Error creating checkout session:', error);
        return res.status(500).json({
            error: 'Failed to create checkout session',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * GET /api/vipps/checkout/session/:reference
 * Get session status
 */
router.get('/checkout/session/:reference', async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        const sessionStatus = await vippsService.getSessionStatus(reference);
        res.json(sessionStatus);
    } catch (error) {
        console.error(`❌ Error getting session status for ${req.params.reference}:`, error);
        res.status(500).json({
            error: 'Failed to get session status',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * PATCH /api/vipps/checkout/session/:reference
 * Update session (e.g., add/remove items)
 */
router.patch('/checkout/session/:reference', async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        const updateData = req.body;

        // Convert items if provided
        if (updateData.items) {
            updateData.orderLines = convertCartItemsToOrderLines(updateData.items, FRONTEND_URL);
            updateData.transaction = {
                amount: {
                    currency: 'NOK',
                    value: calculateTotalAmount(updateData.orderLines),
                },
            };
            delete updateData.items;
        }

        await vippsService.updateSession(reference, updateData);
        res.json({ success: true, message: 'Session updated' });
    } catch (error) {
        console.error(`❌ Error updating session ${req.params.reference}:`, error);
        res.status(500).json({
            error: 'Failed to update session',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * POST /api/vipps/checkout/session/:reference/expire
 * Expire a session
 */
router.post('/checkout/session/:reference/expire', async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        await vippsService.expireSession(reference);
        res.json({ success: true, message: 'Session expired' });
    } catch (error) {
        console.error(`❌ Error expiring session ${req.params.reference}:`, error);
        res.status(500).json({
            error: 'Failed to expire session',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * POST /api/vipps/callback
 * Handle Vipps callbacks
 * This endpoint receives callbacks from Vipps when payment state changes
 */
router.post('/callback', async (req: Request, res: Response) => {
    try {
        // Verify authorization token
        const authHeader = req.headers.authorization;
        if (authHeader !== VIPPS_CALLBACK_AUTHORIZATION_TOKEN) {
            console.error('❌ Invalid callback authorization token');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const callbackData = req.body;
        const { reference, sessionState } = callbackData;

        // Handle terminal states
        if (sessionState === 'PaymentSuccessful') {
            // Get full session details
            const sessionStatus = await vippsService.getSessionStatus(reference);

            // Extract email from shippingDetails, billingDetails, or userDetails
            // Vipps Checkout API v3 returns email in shippingDetails/billingDetails, not userDetails
            const customerEmail = sessionStatus.shippingDetails?.email 
                || sessionStatus.billingDetails?.email 
                || sessionStatus.userDetails?.email;
            
            // Extract customer name
            const customerName = sessionStatus.shippingDetails?.firstName && sessionStatus.shippingDetails?.lastName
                ? `${sessionStatus.shippingDetails.firstName} ${sessionStatus.shippingDetails.lastName}`
                : sessionStatus.billingDetails?.firstName && sessionStatus.billingDetails?.lastName
                ? `${sessionStatus.billingDetails.firstName} ${sessionStatus.billingDetails.lastName}`
                : sessionStatus.userDetails?.address?.name
                || customerEmail?.split('@')[0]
                || 'Kunde';

            if (customerEmail) {
                try {
                    // Get order items from session status or try to retrieve from database
                    let orderItems: Array<{
                        productId: string;
                        productName: string;
                        productImage?: string;
                        size?: string;
                        unitPrice: number;
                        quantity: number;
                        totalPrice: number;
                        taxAmount: number;
                    }> = [];

                    let itemsTotal = 0;
                    const shippingPrice = 7900; // 79 kr in øre
                    let totalAmount = 0;

                    // Try to get order from database first
                    let order = null;
                    if (USE_DATABASE) {
                        try {
                            order = await databaseService.getOrderByReference(reference);
                            if (order) {
                                // Order exists, use it
                                orderItems = order.items.map((item: any) => ({
                                    productId: item.productId,
                                    productName: item.productName,
                                    productImage: item.productImage || undefined,
                                    size: item.size || undefined,
                                    unitPrice: item.unitPrice,
                                    quantity: item.quantity,
                                    totalPrice: item.totalPrice,
                                    taxAmount: item.taxAmount,
                                }));
                                itemsTotal = order.itemsTotal;
                                totalAmount = order.totalAmount;
                            }
                        } catch (dbError) {
                            console.error(`⚠️ Database error when retrieving order ${reference}:`, dbError);
                        }
                    }

                    // If order doesn't exist in database, create it from session data
                    if (!order && sessionStatus.paymentDetails && USE_DATABASE) {
                        // Extract order items from session (if available in orderSummary)
                        // Note: Vipps session status might not include order lines, so we'll create a basic order
                        const paymentAmount = sessionStatus.paymentDetails.amount.value;
                        itemsTotal = paymentAmount - shippingPrice; // Approximate
                        totalAmount = paymentAmount;

                        // Create order in database
                        try {
                            order = await databaseService.createOrder({
                                reference,
                                vippsSessionId: sessionStatus.sessionId || undefined,
                                customerEmail,
                                customerName,
                                customerPhone: sessionStatus.shippingDetails?.phoneNumber || sessionStatus.billingDetails?.phoneNumber,
                                shippingDetails: sessionStatus.shippingDetails,
                                billingDetails: sessionStatus.billingDetails,
                                items: orderItems.length > 0 ? orderItems : [], // Will be empty if we can't extract from session
                                itemsTotal,
                                shippingPrice,
                                totalAmount,
                                paymentMethod: sessionStatus.paymentMethod,
                                paymentState: sessionStatus.paymentDetails.state,
                                amount: paymentAmount,
                                currency: sessionStatus.paymentDetails.amount.currency,
                            });
                            // Update orderItems from created order
                            orderItems = order.items.map((item: any) => ({
                                productId: item.productId,
                                productName: item.productName,
                                productImage: item.productImage || undefined,
                                size: item.size || undefined,
                                unitPrice: item.unitPrice,
                                quantity: item.quantity,
                                totalPrice: item.totalPrice,
                                taxAmount: item.taxAmount,
                            }));
                            itemsTotal = order.itemsTotal;
                            totalAmount = order.totalAmount;
                        } catch (dbError) {
                            console.error(`❌ Failed to create order in database:`, dbError);
                        }
                    } else if (order && USE_DATABASE) {
                        // Update existing order with payment information and customer details
                        try {
                            // Update payment information
                            await databaseService.updateOrderPayment(reference, {
                                paymentMethod: sessionStatus.paymentMethod,
                                paymentState: sessionStatus.paymentDetails?.state,
                                status: 'PAID' as any,
                                paidAt: new Date(),
                            });
                            
                            // Update customer information if it was pending or missing
                            // Always update if email is pending, name is pending, or address fields are null
                            const needsCustomerUpdate = 
                                order.customerEmail === 'pending@example.com' || 
                                !order.customerEmail ||
                                order.customerName === 'Pending' ||
                                order.customerName === 'PENDING' ||
                                !order.shippingFirstName ||
                                !order.shippingStreet;
                            
                            if (needsCustomerUpdate && customerEmail && customerName) {
                                await databaseService.updateOrderCustomer(reference, {
                                    customerEmail,
                                    customerName,
                                    customerPhone: sessionStatus.shippingDetails?.phoneNumber || sessionStatus.billingDetails?.phoneNumber,
                                    shippingDetails: sessionStatus.shippingDetails,
                                    billingDetails: sessionStatus.billingDetails,
                                });
                            }
                        } catch (dbError) {
                            console.error(`❌ Failed to update order payment info:`, dbError);
                        }
                    }

                    // Format items for email
                    const emailItems = orderItems.length > 0 
                        ? orderItems.map(item => {
                            // Find product to get image if not stored
                            const product = products.find(p => p.id === item.productId);
                            // Ensure image URL is absolute HTTPS URL
                            let imageUrl = item.productImage 
                                ? (item.productImage.startsWith('http') ? item.productImage : `${FRONTEND_URL}${item.productImage}`)
                                : (product?.imageUrls?.[0] ? `${FRONTEND_URL}${product.imageUrls[0]}` : 'https://mollerfan.club/merch/tour-hoodie-back.png');
                            
                            // Convert HTTP to HTTPS for production URLs
                            if (imageUrl.startsWith('http://') && !imageUrl.includes('localhost')) {
                                imageUrl = imageUrl.replace('http://', 'https://');
                            }

                            return {
                                name: item.productName,
                                size: item.size,
                                quantity: item.quantity,
                                price: `${(item.totalPrice / 100).toFixed(0)} kr`,
                                image: imageUrl,
                            };
                        })
                        : []; // Empty if we couldn't extract items

                    // Send confirmation email
                    if (emailItems.length > 0 || !USE_DATABASE) {
                        await mailService.sendOrderConfirmation({
                            name: customerName,
                            email: customerEmail,
                            orderNumber: reference,
                            items: emailItems,
                            shippingPrice: `${(shippingPrice / 100).toFixed(0)} kr`,
                            totalPrice: `${(totalAmount / 100).toFixed(0)} kr`,
                            estimatedDelivery: '3-5 virkedager',
                        });
                    }
                } catch (emailError) {
                    console.error(`❌ Failed to process order ${reference}:`, emailError);
                    // Don't throw - we still want to return 2XX to Vipps
                }
            } else {
                console.warn(`⚠️ No email address found for order ${reference} - skipping email confirmation`);
            }
        } else if (sessionState === 'PaymentTerminated' || sessionState === 'PaymentInitiationFailed') {
            // Update order status if it exists in database
            if (USE_DATABASE) {
                try {
                    const order = await databaseService.getOrderByReference(reference);
                    if (order) {
                        await databaseService.updateOrderStatus(reference, 'CANCELLED' as any);
                    }
                } catch (dbError) {
                    // Order might not exist yet, which is fine
                }
            }

            // Notify order@mollerfan.club about the failure
            try {
                await mailService.sendOrderFailureNotification(reference, sessionState);
            } catch (emailError) {
                console.error(`❌ Failed to send failure notification for order ${reference}:`, emailError);
                // Don't throw - we still want to return 2XX to Vipps
            }
        }

        // Always return 2XX to acknowledge receipt
        // Vipps will retry if we don't return 2XX
        return res.status(200).json({ received: true });
    } catch (error) {
        console.error('❌ Error handling callback:', error);
        // Still return 2XX to prevent retries, but log the error
        return res.status(200).json({ received: true, error: 'Processing failed' });
    }
});

/**
 * GET /api/vipps/payment/:reference
 * Get payment details
 */
router.get('/payment/:reference', async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        const paymentDetails = await vippsEPaymentService.getPaymentDetails(reference);
        res.json(paymentDetails);
    } catch (error) {
        console.error(`❌ Error getting payment details for ${req.params.reference}:`, error);
        res.status(500).json({
            error: 'Failed to get payment details',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * POST /api/vipps/payment/:reference/capture
 * Capture a reserved payment
 */
router.post('/payment/:reference/capture', async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        const { amount, currency = 'NOK', transactionText } = req.body;

        // Get payment details to determine capture amount
        const paymentDetails = await vippsEPaymentService.getPaymentDetails(reference);

        const captureAmount = amount || paymentDetails.amount.value;

        const captureRequest: CaptureRequest = {
            modificationAmount: {
                currency,
                value: captureAmount,
            },
            transactionText: transactionText || `Capture for order ${reference}`,
        };

        const result = await vippsEPaymentService.capturePayment(reference, captureRequest);
        res.json({ success: true, payment: result });
    } catch (error) {
        console.error(`❌ Error capturing payment ${req.params.reference}:`, error);
        res.status(500).json({
            error: 'Failed to capture payment',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * POST /api/vipps/payment/:reference/cancel
 * Cancel a reserved payment
 */
router.post('/payment/:reference/cancel', async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        const { transactionText } = req.body;

        const result = await vippsEPaymentService.cancelPayment(
            reference,
            transactionText || `Cancel for order ${reference}`
        );
        res.json({ success: true, payment: result });
    } catch (error) {
        console.error(`❌ Error cancelling payment ${req.params.reference}:`, error);
        res.status(500).json({
            error: 'Failed to cancel payment',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * POST /api/vipps/payment/:reference/refund
 * Refund a captured payment
 */
router.post('/payment/:reference/refund', async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        const { amount, currency = 'NOK', transactionText } = req.body;

        if (!amount) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Refund amount is required',
            });
        }

        const refundRequest: RefundRequest = {
            amount: {
                currency,
                value: amount,
            },
            transactionText: transactionText || `Refund for order ${reference}`,
        };

        const result = await vippsEPaymentService.refundPayment(reference, refundRequest);
        return res.json({ success: true, payment: result });
    } catch (error) {
        console.error(`❌ Error refunding payment ${req.params.reference}:`, error);
        return res.status(500).json({
            error: 'Failed to refund payment',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

export default router;

