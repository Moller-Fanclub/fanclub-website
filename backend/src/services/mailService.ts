import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface OrderItem {
    name: string;
    size?: string;
    quantity: number;
    price: string;
    image?: string;
}

interface OrderEmailData {
    name: string;
    email: string;
    orderNumber: string;
    items: OrderItem[]; // Required - modern structure only
    shippingPrice: string;
    totalPrice: string;
    estimatedDelivery: string;
    productImage?: string;
}

/**
 * Internal mail service - NOT exposed as a public route
 * This service should only be called by backend order processing logic
 */
export class MailService {
    private transporter;

    constructor() {
        // Validate email configuration
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM_SHOP) {
            console.error('❌ Email configuration missing!');
            console.error('   EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Missing');
            console.error('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set' : '✗ Missing');
            console.error('   EMAIL_FROM_SHOP:', process.env.EMAIL_FROM_SHOP ? '✓ Set' : '✗ Missing');
            throw new Error('Email configuration is incomplete. Please set EMAIL_USER, EMAIL_PASS, and EMAIL_FROM_SHOP environment variables.');
        }

        this.transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Verify transporter configuration (only log errors in production)
        this.transporter.verify((error) => {
            if (error) {
                console.error('❌ Email transporter verification failed:', error);
            }
        });
    }

    /**
     * Generate the HTML content for order confirmation email (for preview)
     */
    generateOrderConfirmationHTML(orderData: OrderEmailData): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordrebekreftelse - Møller Fanclub</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                                ⛷️ Møller Fanclub
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Success Badge -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center;">
                            <div style="display: inline-block; padding: 12px 24px; background-color: #10b981; border-radius: 50px; margin-bottom: 16px;">
                                <span style="color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">
                                    ✓ ORDRE BEKREFTET
                                </span>
                            </div>
                            <h2 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 600;">
                                Takk for din bestilling, ${orderData.name}!
                            </h2>
                            <p style="margin: 12px 0 0 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                                Din ordre er nå på vei. Du vil motta en ny e-post med sporingsinformasjon når pakken er sendt.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Order Number -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px; text-align: center;">
                            <div style="display: inline-block; padding: 16px 32px; background-color: #f1f5f9; border-radius: 8px; border: 2px dashed #cbd5e1;">
                                <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                    Ordrenummer
                                </p>
                                <p style="margin: 4px 0 0 0; color: #0f172a; font-size: 20px; font-weight: 700; letter-spacing: 1px;">
                                    ${orderData.orderNumber}
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Product Details -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                                
                                ${orderData.items.map((item, index) => `
                                        <!-- Product Item -->
                                        <table role="presentation" style="width: 100%; border-collapse: collapse; ${index > 0 ? 'border-top: 1px solid #e2e8f0;' : ''}">
                                            <tr>
                                                <td style="width: 140px; padding: 20px; vertical-align: top;">
                                                    <img src="${item.image || orderData.productImage || 'https://mollerfan.club/merch/tour-hoodie-back.png'}" alt="${item.name}" style="width: 100%; max-width: 140px; height: auto; border-radius: 6px; display: block; border: 1px solid #e2e8f0;">
                                                </td>
                                                <td style="padding: 20px; vertical-align: top;">
                                                    <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 18px; font-weight: 600;">
                                                        ${item.name}
                                                    </h3>
                                                    <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                                                        ${item.size ? `<strong>Størrelse:</strong> ${item.size}<br>` : ''}
                                                        <strong>Antall:</strong> ${item.quantity}
                                                    </p>
                                                    <p style="margin: 16px 0 0 0; color: #0f172a; font-size: 20px; font-weight: 700;">
                                                        ${item.price}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    `).join('')}
                                
                                <!-- Price Breakdown -->
                                <table role="presentation" style="width: 100%; border-collapse: collapse; border-top: 1px solid #e2e8f0; background-color: #f8fafc;">
                                    <tr>
                                        <td style="padding: 16px 20px;">
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="padding: 4px 0; color: #64748b; font-size: 14px;">
                                                        Delsum
                                                    </td>
                                                    <td style="padding: 4px 0; text-align: right; color: #0f172a; font-size: 14px;">
                                                        ${orderData.items.reduce((sum, item) => {
                                                            const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
                                                            return sum + (price * item.quantity);
                                                        }, 0).toFixed(0) + ' kr'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 4px 0; color: #64748b; font-size: 14px;">
                                                        Frakt
                                                    </td>
                                                    <td style="padding: 4px 0; text-align: right; color: #0f172a; font-size: 14px;">
                                                        ${orderData.shippingPrice}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 600; border-top: 1px solid #cbd5e1;">
                                                        Total
                                                    </td>
                                                    <td style="padding: 12px 0 0 0; text-align: right; color: #0f172a; font-size: 18px; font-weight: 700; border-top: 1px solid #cbd5e1;">
                                                        ${orderData.totalPrice}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Shipping Info -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 6px;">
                                <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                                    📦 Leveringsinformasjon
                                </p>
                                <p style="margin: 8px 0 0 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">
                                    Forventet levering: <strong>${orderData.estimatedDelivery}</strong><br>
                                    Du vil motta sporingsinformasjon på e-post når pakken er sendt.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px; text-align: center;">
                            <a href="https://mollerfan.club/orders/${orderData.orderNumber}" style="display: inline-block; padding: 14px 36px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
                                Spor din ordre
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px; line-height: 1.6; text-align: center;">
                                Har du spørsmål om din ordre?<br>
                                Kontakt oss på <a href="mailto:${process.env.EMAIL_USER || 'shop@mollerfan.club'}" style="color: #3b82f6; text-decoration: none;">${process.env.EMAIL_USER || 'support@mollerfan.club'}</a>
                            </p>
                            <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} Møller Fanclub • <a href="https://mollerfan.club" style="color: #3b82f6; text-decoration: none;">mollerfan.club</a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `.trim();
    }

    /**
     * Send order confirmation email
     * Should only be called internally after order is created and validated
     */
    async sendOrderConfirmation(orderData: OrderEmailData): Promise<void> {
        if (!process.env.EMAIL_FROM_SHOP) {
            throw new Error('EMAIL_FROM_SHOP environment variable is not set');
        }

        try {
            await this.transporter.sendMail({
                from: `"Møller Fanclub Shop" <${process.env.EMAIL_FROM_SHOP}>`,
                to: orderData.email,
                bcc: 'order@mollerfan.club', // BCC to order tracking email
                subject: `Ordrebekreftelse #${orderData.orderNumber} - Møller Fanclub`,
            text: `
Hei ${orderData.name}!

Takk for din bestilling hos Møller Fanclub!

Ordrenummer: ${orderData.orderNumber}

${orderData.items.map(item =>
    `${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ''} - ${item.price}`
).join('\n')}

Frakt: ${orderData.shippingPrice}
Total: ${orderData.totalPrice}

Din ordre er nå på vei og vil bli levert innen ${orderData.estimatedDelivery}.

Med vennlig hilsen,
Møller Fanclub
            `.trim(),
            html: this.generateOrderConfirmationHTML(orderData),
                // No attachments needed - using external image URLs
                attachments: []
            });

            // Email sent successfully - log in production
            if (process.env.NODE_ENV === 'production') {
                console.log(`✅ Order confirmation email sent to ${orderData.email} for order ${orderData.orderNumber}`);
            }
        } catch (error) {
            console.error(`❌ Failed to send email to ${orderData.email}:`, error);
            if (error instanceof Error) {
                console.error('   Error details:', error.message);
            }
            throw error; // Re-throw to let caller handle it
        }
    }

    /**
     * Send order failure notification to order@mollerfan.club
     */
    async sendOrderFailureNotification(reference: string, sessionState: string, errorDetails?: string): Promise<void> {
        if (!process.env.EMAIL_FROM_SHOP) {
            throw new Error('EMAIL_FROM_SHOP environment variable is not set');
        }

        const failureHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordre feilet - Møller Fanclub</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                                ⛷️ Møller Fanclub
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Failure Badge -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center;">
                            <div style="display: inline-block; padding: 12px 24px; background-color: #dc2626; border-radius: 50px; margin-bottom: 16px;">
                                <span style="color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">
                                    ❌ ORDRE FEILET
                                </span>
                            </div>
                            <h2 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 600;">
                                Ordre feilet
                            </h2>
                        </td>
                    </tr>
                    
                    <!-- Order Details -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 6px;">
                                <p style="margin: 0 0 12px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                                    Ordreinformasjon
                                </p>
                                <p style="margin: 4px 0; color: #7f1d1d; font-size: 14px; line-height: 1.6;">
                                    <strong>Ordrenummer:</strong> ${reference}
                                </p>
                                <p style="margin: 4px 0; color: #7f1d1d; font-size: 14px; line-height: 1.6;">
                                    <strong>Status:</strong> ${sessionState}
                                </p>
                                ${errorDetails ? `
                                <p style="margin: 8px 0 0 0; color: #7f1d1d; font-size: 14px; line-height: 1.6;">
                                    <strong>Detaljer:</strong><br>
                                    <code style="background-color: #fee2e2; padding: 8px; border-radius: 4px; display: inline-block; font-size: 12px;">${errorDetails}</code>
                                </p>
                                ` : ''}
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} Møller Fanclub • <a href="https://mollerfan.club" style="color: #3b82f6; text-decoration: none;">mollerfan.club</a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `.trim();

        try {
            await this.transporter.sendMail({
                from: `"Møller Fanclub Shop" <${process.env.EMAIL_FROM_SHOP}>`,
                to: 'order@mollerfan.club',
                subject: `❌ Ordre feilet: ${reference} - ${sessionState}`,
                text: `
Ordre feilet

Ordrenummer: ${reference}
Status: ${sessionState}
${errorDetails ? `\nDetaljer: ${errorDetails}` : ''}

Dette er en automatisk varsling fra Møller Fanclub ordresystem.
                `.trim(),
                html: failureHTML,
            });

            if (process.env.NODE_ENV === 'production') {
                console.log(`✅ Order failure notification sent to order@mollerfan.club for order ${reference}`);
            }
        } catch (error) {
            console.error(`❌ Failed to send failure notification for order ${reference}:`, error);
            if (error instanceof Error) {
                console.error('   Error details:', error.message);
            }
            // Don't throw - failure notifications are not critical
        }
    }
}

export const mailService = new MailService();
