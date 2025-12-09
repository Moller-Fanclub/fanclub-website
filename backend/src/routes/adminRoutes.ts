import express from 'express';
import type { Request, Response } from 'express';
import { auth } from '../auth.js';
import { databaseService } from '../services/databaseService.js';
import { orderCleanupService } from '../services/orderCleanupService.js';
import { vippsEPaymentService } from '../services/vippsEPaymentService.js';

const router = express.Router();

/**
 * Middleware to check if user is authenticated
 */
async function requireAuth(req: Request, res: Response, next: express.NextFunction): Promise<void> {
    try {
        // Skip auth in development if SKIP_ADMIN_AUTH is set
        if (process.env.SKIP_ADMIN_AUTH === 'true') {
            next();
            return;
        }

        // Better Auth expects a Request object
        // Convert Express request to a Web API Request-like object
        const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const webRequest = new Request(url, {
            method: req.method,
            headers: req.headers as any,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        });
        
        const session = await auth.api.getSession(webRequest);
        
        if (!session || !session.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        
        // Attach session to request for use in routes
        (req as any).session = session;
        (req as any).user = session.user;
        next();
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
}

/**
 * GET /api/admin/orders
 * Get all orders with pagination
 */
router.get('/orders', requireAuth, async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;
        const statusFilter = req.query.status as string | undefined;
        
        const orders = await databaseService.getAllOrders(limit, offset);
        
        // Filter by status if provided
        let filteredOrders = orders;
        if (statusFilter && statusFilter !== 'ALL') {
            filteredOrders = orders.filter((order: any) => order.status === statusFilter);
        }
        
        // Format orders for frontend
        const formattedOrders = filteredOrders.map((order: any) => ({
            id: order.id,
            reference: order.reference,
            status: order.status,
            customerEmail: order.customerEmail,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            shippingAddress: {
                firstName: order.shippingFirstName,
                lastName: order.shippingLastName,
                street: order.shippingStreet,
                postalCode: order.shippingPostalCode,
                city: order.shippingCity,
                country: order.shippingCountry,
            },
            billingAddress: {
                firstName: order.billingFirstName,
                lastName: order.billingLastName,
                street: order.billingStreet,
                postalCode: order.billingPostalCode,
                city: order.billingCity,
                country: order.billingCountry,
            },
            items: order.items.map((item: any) => ({
                id: item.id,
                productId: item.productId,
                productName: item.productName,
                productImage: item.productImage,
                size: item.size,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
            })),
            itemsTotal: order.itemsTotal,
            shippingPrice: order.shippingPrice,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            paymentState: order.paymentState,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            paidAt: order.paidAt,
            shippedAt: order.shippedAt,
        }));
        
        res.json({
            orders: formattedOrders,
            pagination: {
                limit,
                offset,
                total: formattedOrders.length,
            },
        });
        return;
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            error: 'Failed to fetch orders',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
    }
});

/**
 * GET /api/admin/orders/:reference
 * Get a single order by reference
 */
router.get('/orders/:reference', requireAuth, async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        const order = await databaseService.getOrderByReference(reference);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        // Format order for frontend
        const formattedOrder = {
            id: order.id,
            reference: order.reference,
            status: order.status,
            customerEmail: order.customerEmail,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            shippingAddress: {
                firstName: order.shippingFirstName,
                lastName: order.shippingLastName,
                street: order.shippingStreet,
                postalCode: order.shippingPostalCode,
                city: order.shippingCity,
                country: order.shippingCountry,
            },
            billingAddress: {
                firstName: order.billingFirstName,
                lastName: order.billingLastName,
                street: order.billingStreet,
                postalCode: order.billingPostalCode,
                city: order.billingCity,
                country: order.billingCountry,
            },
            items: order.items.map((item: any) => ({
                id: item.id,
                productId: item.productId,
                productName: item.productName,
                productImage: item.productImage,
                size: item.size,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
            })),
            itemsTotal: order.itemsTotal,
            shippingPrice: order.shippingPrice,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            paymentState: order.paymentState,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            paidAt: order.paidAt,
            shippedAt: order.shippedAt,
        };
        
        res.json(formattedOrder);
        return;
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            error: 'Failed to fetch order',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
    }
});

/**
 * PATCH /api/admin/orders/:reference/status
 * Update order status
 */
router.patch('/orders/:reference/status', requireAuth, async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        const { status, shippedAt } = req.body;
        
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        
        const order = await databaseService.updateOrderStatus(
            reference,
            status,
            shippedAt ? { shippedAt: new Date(shippedAt) } : undefined
        );
        
        res.json({
            success: true,
            order: {
                id: order.id,
                reference: order.reference,
                status: order.status,
                shippedAt: order.shippedAt,
            },
        });
        return;
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            error: 'Failed to update order status',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
    }
});

/**
 * POST /api/admin/orders/cleanup
 * Cleanup abandoned orders (mark old PENDING orders as CANCELLED)
 */
router.post('/orders/cleanup', requireAuth, async (req: Request, res: Response) => {
    try {
        const { maxAgeHours = 24 } = req.body;
        const result = await orderCleanupService.cleanupAbandonedOrders(maxAgeHours);
        
        res.json({
            success: true,
            ...result,
            message: `Marked ${result.cancelled} abandoned orders as CANCELLED`,
        });
        return;
    } catch (error) {
        console.error('Error cleaning up orders:', error);
        res.status(500).json({
            error: 'Failed to cleanup orders',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
    }
});

/**
 * GET /api/admin/orders/stats/abandoned
 * Get statistics about abandoned orders
 */
router.get('/orders/stats/abandoned', requireAuth, async (req: Request, res: Response) => {
    try {
        const maxAgeHours = parseInt(req.query.maxAgeHours as string) || 24;
        const stats = await orderCleanupService.getAbandonedOrderStats(maxAgeHours);
        
        res.json(stats);
        return;
    } catch (error) {
        console.error('Error getting abandoned order stats:', error);
        res.status(500).json({
            error: 'Failed to get abandoned order stats',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
    }
});

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
router.get('/stats', requireAuth, async (_req: Request, res: Response) => {
    try {
        // Get all orders for stats
        const orders = await databaseService.getAllOrders(1000, 0);
        
        const stats = {
            totalOrders: orders.length,
            totalRevenue: orders
                .filter((o: any) => o.status === 'PAID' || o.status === 'SHIPPED' || o.status === 'DELIVERED')
                .reduce((sum: number, o: any) => sum + o.totalAmount, 0),
            pendingOrders: orders.filter((o: any) => o.status === 'PENDING' || o.status === 'PAYMENT_PENDING').length,
            paidOrders: orders.filter((o: any) => o.status === 'PAID').length,
            shippedOrders: orders.filter((o: any) => o.status === 'SHIPPED').length,
            cancelledOrders: orders.filter((o: any) => o.status === 'CANCELLED').length,
        };
        
        res.json(stats);
        return;
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            error: 'Failed to fetch stats',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
    }
});

/**
 * POST /api/admin/orders/:reference/capture
 * Capture a reserved payment
 */
router.post('/orders/:reference/capture', requireAuth, async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        
        // Get order from database
        const order = await databaseService.getOrderByReference(reference);
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        // Verify order status
        const paymentDetails = await vippsEPaymentService.getPaymentDetails(reference);
        if (paymentDetails.state !== 'RESERVED') {
            res.status(400).json({ 
                error: 'Invalid payment state',
                message: `Payment must be in RESERVED state to capture. Current state: ${paymentDetails.state}`
            });
            return;
        }

        // Capture the full amount
        await vippsEPaymentService.capturePayment(reference, {
            modificationAmount: {
                currency: 'NOK',
                value: order.amount
            }
        });

        // Update order status to PAID
        await databaseService.updateOrderPayment(reference, {
            status: 'PAID',
            paidAt: new Date()
        });

        res.json({ 
            success: true,
            message: 'Payment captured successfully',
            reference
        });
        return;
    } catch (error) {
        console.error('Error capturing payment:', error);
        res.status(500).json({
            error: 'Failed to capture payment',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
    }
});

/**
 * POST /api/admin/orders/:reference/cancel
 * Cancel a reserved payment
 */
router.post('/orders/:reference/cancel', requireAuth, async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        
        // Get order from database
        const order = await databaseService.getOrderByReference(reference);
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        // Verify order status
        const paymentDetails = await vippsEPaymentService.getPaymentDetails(reference);
        if (paymentDetails.state !== 'RESERVED') {
            res.status(400).json({ 
                error: 'Invalid payment state',
                message: `Payment must be in RESERVED state to cancel. Current state: ${paymentDetails.state}`
            });
            return;
        }

        // Cancel the payment
        await vippsEPaymentService.cancelPayment(reference, 'Cancelled by admin');

        // Update order status to CANCELLED
        await databaseService.updateOrderPayment(reference, {
            status: 'CANCELLED'
        });

        res.json({ 
            success: true,
            message: 'Payment cancelled successfully',
            reference
        });
        return;
    } catch (error) {
        console.error('Error cancelling payment:', error);
        res.status(500).json({
            error: 'Failed to cancel payment',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
    }
});

/**
 * POST /api/admin/orders/:reference/refund
 * Refund a captured payment
 */
router.post('/orders/:reference/refund', requireAuth, async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        
        // Get order from database
        const order = await databaseService.getOrderByReference(reference);
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        // Verify order status
        const paymentDetails = await vippsEPaymentService.getPaymentDetails(reference);
        if (paymentDetails.state !== 'CAPTURED') {
            res.status(400).json({ 
                error: 'Invalid payment state',
                message: `Payment must be in CAPTURED state to refund. Current state: ${paymentDetails.state}`
            });
            return;
        }

        // Refund the full amount
        await vippsEPaymentService.refundPayment(reference, {
            modificationAmount: {
                currency: 'NOK',
                value: order.amount
            }
        });

        // Fetch updated payment details to get actual state
        const updatedDetails = await vippsEPaymentService.getPaymentDetails(reference);
        
        // Update order status based on aggregate
        await databaseService.updateOrderPayment(reference, {
            status: updatedDetails.state === 'REFUNDED' ? 'REFUNDED' : 'PAID'
        });

        res.json({ 
            success: true,
            message: 'Payment refunded successfully',
            reference
        });
        return;
    } catch (error) {
        console.error('Error refunding payment:', error);
        res.status(500).json({
            error: 'Failed to refund payment',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
    }
});

/**
 * POST /api/admin/capture-all
 * Capture all reserved payments
 */
router.post('/capture-all', requireAuth, async (req: Request, res: Response) => {
    try {
        // Get all orders and filter for RESERVED status
        const allOrders = await databaseService.getAllOrders(1000);
        const orders = allOrders.filter((order: any) => order.status === 'RESERVED');
        
        let successful = 0;
        let failed = 0;
        const errors: string[] = [];

        for (const order of orders) {
            try {
                await vippsEPaymentService.capturePayment(order.reference, {
                    modificationAmount: {
                        currency: 'NOK',
                        value: order.amount
                    }
                });

                await databaseService.updateOrderPayment(order.reference, {
                    status: 'PAID',
                    paidAt: new Date()
                });

                successful++;
            } catch (error) {
                failed++;
                errors.push(`${order.reference}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                console.error(`Failed to capture ${order.reference}:`, error);
            }
        }

        res.json({ 
            success: true,
            successful,
            failed,
            total: orders.length,
            errors: failed > 0 ? errors : undefined
        });
        return;
    } catch (error) {
        console.error('Error in capture all:', error);
        res.status(500).json({
            error: 'Failed to capture payments',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
    }
});

export default router;
