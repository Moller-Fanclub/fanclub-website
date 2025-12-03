import dotenv from 'dotenv';
import { ConfidentialClientApplication } from '@azure/msal-node';
import axios from 'axios';

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
    private msalClient: ConfidentialClientApplication | null = null;
    private cachedAccessToken: string | null = null;
    private tokenExpiresAt: number = 0;
    private isConfigured: boolean = false;

    constructor() {
        // Validate email configuration for OAuth2
        const requiredVars = [
            'EMAIL_USER',
            'EMAIL_FROM_SHOP',
            'AZURE_CLIENT_ID',
            'AZURE_CLIENT_SECRET',
            'AZURE_TENANT_ID'
        ];

        const missingVars = requiredVars.filter(varName => !process.env[varName]);

        if (missingVars.length > 0) {
            console.warn('⚠️  Email configuration missing - email sending will be disabled');
            console.warn('   This is OK for local development without email setup');
            requiredVars.forEach(varName => {
                console.warn(`   ${varName}:`, process.env[varName] ? '✓ Set' : '✗ Missing');
            });
            console.warn('   Shop functionality will work, but order confirmation emails will be skipped');
            this.isConfigured = false;
            return;
        }

        // Initialize MSAL client for OAuth2 token acquisition
        try {
            this.msalClient = new ConfidentialClientApplication({
                auth: {
                    clientId: process.env.AZURE_CLIENT_ID!,
                    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
                    clientSecret: process.env.AZURE_CLIENT_SECRET!
                }
            });

            // Using Microsoft Graph API for sending emails (recommended for application-level auth)
            console.log('📧 Email service configured with Microsoft Graph API');
            console.log(`   Sender: ${process.env.EMAIL_FROM_SHOP}`);
            this.isConfigured = true;
        } catch (error) {
            console.error('❌ Failed to initialize email service:', error);
            this.isConfigured = false;
        }
    }

    /**
     * Get OAuth2 access token, using cache if still valid
     * Uses the Mail.Send permission from Microsoft Graph
     */
    private async getAccessToken(): Promise<string> {
        if (!this.isConfigured || !this.msalClient) {
            throw new Error('Email service is not configured');
        }

        // Return cached token if still valid (with 5 minute buffer)
        const now = Date.now();
        if (this.cachedAccessToken && this.tokenExpiresAt > now + 5 * 60 * 1000) {
            return this.cachedAccessToken;
        }

        try {
            // Use Microsoft Graph scope for Mail.Send permission
            // This is the recommended approach for application-level email sending
            const tokenRequest = {
                scopes: ['https://graph.microsoft.com/.default']
            };

            const response = await this.msalClient!.acquireTokenByClientCredential(tokenRequest);

            if (!response || !response.accessToken) {
                throw new Error('Failed to acquire access token');
            }

            // Cache the token
            this.cachedAccessToken = response.accessToken;
            // Set expiration (tokens typically expire in 1 hour, but we'll use expiresOn if available)
            if (response.expiresOn) {
                this.tokenExpiresAt = response.expiresOn.getTime();
            } else {
                // Default to 1 hour if expiresOn is not available
                this.tokenExpiresAt = now + 60 * 60 * 1000;
            }

            if (!this.cachedAccessToken) {
                throw new Error('Failed to cache access token');
            }
            return this.cachedAccessToken;
        } catch (error) {
            console.error('❌ Failed to acquire OAuth2 access token:', error);
            if (error instanceof Error) {
                console.error('   Error message:', error.message);
                console.error('   Error stack:', error.stack);
            }
            throw error;
        }
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
     * Send email using Microsoft Graph API
     * This is the recommended approach for application-level authentication
     */
    private async sendEmailViaGraph(
        to: string | string[],
        subject: string,
        _text: string, // Text version (unused but kept for API consistency)
        html: string,
        bcc?: string | string[]
    ): Promise<void> {
        const token = await this.getAccessToken();

        // Get the sender email
        const senderEmail = process.env.EMAIL_FROM_SHOP!;

        // Prepare recipients
        const toAddresses = Array.isArray(to) ? to : [to];
        const bccAddresses = bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : [];

        // Build the message payload for Microsoft Graph API
        const message = {
            message: {
                subject: subject,
                body: {
                    contentType: 'HTML',
                    content: html
                },
                toRecipients: toAddresses.map(email => ({
                    emailAddress: {
                        address: email
                    }
                })),
                ...(bccAddresses.length > 0 && {
                    bccRecipients: bccAddresses.map(email => ({
                        emailAddress: {
                            address: email
                        }
                    }))
                })
            },
            saveToSentItems: true
        };

        // Send email via Microsoft Graph API
        await axios.post(
            `https://graph.microsoft.com/v1.0/users/${senderEmail}/sendMail`,
            message,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (process.env.NODE_ENV === 'development') {
        }
    }

    /**
     * Send order confirmation email
     * Should only be called internally after order is created and validated
     */
    async sendOrderConfirmation(orderData: OrderEmailData): Promise<void> {
        if (!this.isConfigured) {
            console.warn('⚠️  Email service not configured - skipping order confirmation email');
            console.warn(`   Order ${orderData.orderNumber} for ${orderData.email} would have been sent`);
            return;
        }

        if (!process.env.EMAIL_FROM_SHOP) {
            console.warn('⚠️  EMAIL_FROM_SHOP not set - skipping order confirmation email');
            return;
        }


        try {
            const textContent = `
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
            `.trim();

            await this.sendEmailViaGraph(
                orderData.email,
                `Ordrebekreftelse #${orderData.orderNumber} - Møller Fanclub`,
                textContent,
                this.generateOrderConfirmationHTML(orderData),
                'order@mollerfan.club'
            );

            // Email sent successfully - log in production
            if (process.env.NODE_ENV === 'production') {
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
        if (!this.isConfigured) {
            console.warn('⚠️  Email service not configured - skipping order failure notification');
            console.warn(`   Order ${reference} failed with state: ${sessionState}`);
            return;
        }

        if (!process.env.EMAIL_FROM_SHOP) {
            console.warn('⚠️  EMAIL_FROM_SHOP not set - skipping order failure notification');
            return;
        }

        const failureText = `
Ordre feilet

Ordrenummer: ${reference}
Status: ${sessionState}
${errorDetails ? `\nDetaljer: ${errorDetails}` : ''}

Dette er en automatisk varsling fra Møller Fanclub ordresystem.
        `.trim();

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
            await this.sendEmailViaGraph(
                'order@mollerfan.club',
                `❌ Ordre feilet: ${reference} - ${sessionState}`,
                failureText,
                failureHTML
            );

            if (process.env.NODE_ENV === 'production') {
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
