import axios, { AxiosInstance, AxiosError } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Vipps API Configuration
const VIPPS_API_BASE_URL = process.env.VIPPS_API_BASE_URL || 'https://apitest.vipps.no';
const VIPPS_CLIENT_ID = process.env.VIPPS_CLIENT_ID;
const VIPPS_CLIENT_SECRET = process.env.VIPPS_CLIENT_SECRET;
const VIPPS_SUBSCRIPTION_KEY = process.env.VIPPS_SUBSCRIPTION_KEY;
const VIPPS_MSN = process.env.VIPPS_MSN;

// Request timeout (30 seconds as recommended)
const REQUEST_TIMEOUT = 30000;

// Types
interface AccessTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}

interface VippsError {
    error?: string;
    error_description?: string;
    errorCode?: string;
    message?: string;
}

// Vipps Checkout Session Types
export type SessionType = 'PAYMENT' | 'SUBSCRIPTION';
export type ElementsMode = 'Full' | 'PaymentOnly' | 'PaymentAndContactInfo';

export interface ShippingDetails {
    isShipping?: boolean;
    fixedOptions?: Array<{
        amount: number;
        priority: number;
        description: string;
        vippsLogistics?: {
            product: string;
            service: string;
        };
    }>;
}

export interface PrefillCustomer {
    phoneNumber?: string;
    email?: string;
    dateOfBirth?: string;
}

export interface CheckoutSessionConfig {
    elements?: ElementsMode;
    shippingDetails?: ShippingDetails;
    prefillCustomer?: PrefillCustomer;
    showOrderSummary?: boolean; // Display order summary in checkout window
    customConsent?: {
        required: boolean;
        text: string;
    };
}

export interface OrderLine {
    name: string;
    id: string;
    totalAmount: number;
    totalAmountExcludingTax: number;
    totalTaxAmount: number;
    taxPercentage: number;
    unitInfo: {
        unitPrice: number;
        quantity: string; // Vipps API expects quantity as string
        quantityUnit: string;
    };
    productUrl?: string;
    isReturn: boolean;
    isShipping: boolean;
    imageUrl?: string;
}

export interface CreateCheckoutSessionRequest {
    type: 'PAYMENT' | 'SUBSCRIPTION';
    reference: string;
    transaction: {
        amount: {
            currency: string;
            value: number;
        };
        reference: string;
        paymentDescription?: string;
        orderSummary?: {
            orderLines: OrderLine[];
            orderBottomLine: {
                currency: string;
                amount: number;
            };
        };
    };
    merchantInfo: {
        callbackUrl: string;
        returnUrl: string;
        callbackAuthorizationToken?: string;
        termsAndConditionsUrl?: string;
    };
    logistics?: {
        dynamicOptionsCallback?: string;
        fixedOptions?: Array<{
            id: string;
            priority: number;
            amount: {
                value: number;
                currency: string;
            };
            title: string; // Required by Vipps API
            description: string;
            brand?: 'POSTEN' | 'BRING' | 'OTHER';
            isDefault?: boolean;
            vippsLogistics?: {
                product: string;
                service: string;
            };
        }>;
        integrations?: Record<string, any>;
    };
    prefillCustomer?: PrefillCustomer;
    configuration?: CheckoutSessionConfig;
}

export interface CreateCheckoutSessionResponse {
    token: string;
    checkoutFrontendUrl: string;
    pollingUrl: string;
    cancelUrl: string;
}

export interface SessionStatusResponse {
    sessionId?: string;
    sessionState: string;
    reference: string;
    paymentMethod?: string;
    paymentDetails?: {
        type: string;
        state: string;
        amount: {
            value: number;
            currency: string;
        };
    };
    subscriptionDetails?: {
        agreementId: string;
        state: string;
    };
    shippingDetails?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        streetAddress?: string;
        postalCode?: string;
        city?: string;
        country?: string;
    };
    billingDetails?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        streetAddress?: string;
        postalCode?: string;
        city?: string;
        country?: string;
    };
    userDetails?: {
        userId: string;
        email?: string;
        mobileNumber?: string;
        address?: any;
    };
}

export class VippsService {
    private axiosInstance: AxiosInstance | null = null;
    private accessToken: string | null = null;
    private tokenExpiry: number = 0;
    private isConfigured: boolean = false;

    constructor() {
        // Validate required environment variables
        const missingVars: string[] = [];
        if (!VIPPS_CLIENT_ID) missingVars.push('VIPPS_CLIENT_ID');
        if (!VIPPS_CLIENT_SECRET) missingVars.push('VIPPS_CLIENT_SECRET');
        if (!VIPPS_SUBSCRIPTION_KEY) missingVars.push('VIPPS_SUBSCRIPTION_KEY');
        if (!VIPPS_MSN) missingVars.push('VIPPS_MSN');

        if (missingVars.length > 0) {
            console.warn('⚠️  Vipps service not configured. Missing environment variables:');
            missingVars.forEach(v => console.warn(`   - ${v}`));
            console.warn('   Vipps payment functionality will not be available.');
            this.isConfigured = false;
        } else {
            this.isConfigured = true;
            this.axiosInstance = axios.create({
                baseURL: VIPPS_API_BASE_URL,
                timeout: REQUEST_TIMEOUT,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    }

    /**
     * Get OAuth2 access token from Vipps
     * Tokens are cached and reused until expiry
     */
    async getAccessToken(): Promise<string> {
        if (!this.isConfigured) {
            throw new Error('Vipps service is not configured. Please set required environment variables.');
        }

        // Return cached token if still valid (with 60 second buffer)
        const now = Date.now();
        if (this.accessToken && this.tokenExpiry > now + 60000) {
            return this.accessToken;
        }

        try {
            // Vipps requires client_id and client_secret as headers, not in body
            const response = await axios.post<AccessTokenResponse>(
                `${VIPPS_API_BASE_URL}/accessToken/get`,
                {}, // Empty body
                {
                    timeout: REQUEST_TIMEOUT,
                    headers: {
                        'client_id': VIPPS_CLIENT_ID!,
                        'client_secret': VIPPS_CLIENT_SECRET!,
                        'Ocp-Apim-Subscription-Key': VIPPS_SUBSCRIPTION_KEY!,
                        'Content-Type': 'application/json',
                    },
                }
            );

            this.accessToken = response.data.access_token;
            // Set expiry time (subtract 60 seconds for safety margin)
            this.tokenExpiry = now + (response.data.expires_in * 1000) - 60000;

            return this.accessToken;
        } catch (error) {
            const axiosError = error as AxiosError<VippsError>;
            console.error('❌ Failed to get Vipps access token:', axiosError.response?.data || axiosError.message);
            throw new Error(`Failed to get Vipps access token: ${axiosError.response?.data?.error_description || axiosError.message}`);
        }
    }

    /**
     * Create a new Checkout session
     */
    async createCheckoutSession(sessionData: CreateCheckoutSessionRequest): Promise<CreateCheckoutSessionResponse> {
        if (!this.isConfigured || !this.axiosInstance) {
            throw new Error('Vipps service is not configured. Please set required environment variables.');
        }

        try {
            // Vipps Checkout API v3 requires client_id and client_secret as headers (not OAuth token)
            // Also requires system headers for tracking
            // Note: Don't set Content-Type manually - axios handles it automatically
            const headers: Record<string, string> = {
                'client_id': VIPPS_CLIENT_ID!,
                'client_secret': VIPPS_CLIENT_SECRET!,
                'Ocp-Apim-Subscription-Key': VIPPS_SUBSCRIPTION_KEY!,
                'Merchant-Serial-Number': VIPPS_MSN!,
                // System headers (required by Vipps)
                'Vipps-System-Name': 'Moller Fanclub',
                'Vipps-System-Version': '1.0.0',
                'Vipps-System-Plugin-Name': 'custom-integration',
                'Vipps-System-Plugin-Version': '1.0.0',
            };


            const response = await this.axiosInstance.post<CreateCheckoutSessionResponse>(
                '/checkout/v3/session',
                sessionData,
                {
                    headers,
                }
            );

            // Check response status
            if (response.status !== 200 && response.status !== 201) {
                console.error('❌ Unexpected response status:', response.status);
                console.error('Response data:', response.data);
                throw new Error(`Unexpected response status: ${response.status}`);
            }

            // Validate response
            if (!response.data || !response.data.token || !response.data.checkoutFrontendUrl) {
                console.error('❌ Invalid response from Vipps:', response.data);
                throw new Error('Invalid response from Vipps: missing required fields (token or checkoutFrontendUrl)');
            }

            console.log(`✅ Vipps checkout session created: ${sessionData.transaction.reference}`);


            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            
            // Log full error response for debugging
            if (axiosError.response) {
                console.error('❌ Full Vipps API Error Response:');
                console.error(JSON.stringify(axiosError.response.data, null, 2));
                
                // Log specific validation errors
                if (axiosError.response.data?.value?.errors) {
                    console.error('📋 Validation Errors:');
                    const errors = axiosError.response.data.value.errors;
                    Object.keys(errors).forEach(key => {
                        console.error(`  ${key}:`, errors[key]);
                    });
                }
            }
            
            throw this.handleError(axiosError, 'Failed to create checkout session');
        }
    }

    /**
     * Get session status by reference
     */
    async getSessionStatus(reference: string): Promise<SessionStatusResponse> {
        if (!this.isConfigured || !this.axiosInstance) {
            throw new Error('Vipps service is not configured. Please set required environment variables.');
        }

        try {
            // Vipps Checkout API v3 requires client_id and client_secret as headers
            const headers: Record<string, string> = {
                'client_id': VIPPS_CLIENT_ID!,
                'client_secret': VIPPS_CLIENT_SECRET!,
                'Ocp-Apim-Subscription-Key': VIPPS_SUBSCRIPTION_KEY!,
                'Merchant-Serial-Number': VIPPS_MSN!,
                'Vipps-System-Name': 'Moller Fanclub',
                'Vipps-System-Version': '1.0.0',
                'Vipps-System-Plugin-Name': 'custom-integration',
                'Vipps-System-Plugin-Version': '1.0.0',
            };

            const response = await this.axiosInstance.get<SessionStatusResponse>(
                `/checkout/v3/session/${reference}`,
                {
                    headers,
                }
            );

            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<VippsError>;
            console.error(`❌ Failed to get session status for ${reference}:`, axiosError.response?.data || axiosError.message);
            throw this.handleError(axiosError, 'Failed to get session status');
        }
    }

    /**
     * Update an existing checkout session
     */
    async updateSession(reference: string, updateData: Partial<CreateCheckoutSessionRequest>): Promise<void> {
        if (!this.isConfigured || !this.axiosInstance) {
            throw new Error('Vipps service is not configured. Please set required environment variables.');
        }

        try {
            // Vipps Checkout API v3 requires client_id and client_secret as headers
            const headers: Record<string, string> = {
                'client_id': VIPPS_CLIENT_ID!,
                'client_secret': VIPPS_CLIENT_SECRET!,
                'Ocp-Apim-Subscription-Key': VIPPS_SUBSCRIPTION_KEY!,
                'Merchant-Serial-Number': VIPPS_MSN!,
                'Content-Type': 'application/json',
                'Vipps-System-Name': 'Moller Fanclub',
                'Vipps-System-Version': '1.0.0',
                'Vipps-System-Plugin-Name': 'custom-integration',
                'Vipps-System-Plugin-Version': '1.0.0',
            };

            await this.axiosInstance.patch(
                `/checkout/v3/session/${reference}`,
                updateData,
                {
                    headers,
                }
            );

        } catch (error) {
            const axiosError = error as AxiosError<VippsError>;
            console.error(`❌ Failed to update session ${reference}:`, axiosError.response?.data || axiosError.message);
            throw this.handleError(axiosError, 'Failed to update session');
        }
    }

    /**
     * Expire a checkout session
     */
    async expireSession(reference: string): Promise<void> {
        if (!this.isConfigured || !this.axiosInstance) {
            throw new Error('Vipps service is not configured. Please set required environment variables.');
        }

        try {
            // Vipps Checkout API v3 requires client_id and client_secret as headers
            const headers: Record<string, string> = {
                'client_id': VIPPS_CLIENT_ID!,
                'client_secret': VIPPS_CLIENT_SECRET!,
                'Ocp-Apim-Subscription-Key': VIPPS_SUBSCRIPTION_KEY!,
                'Merchant-Serial-Number': VIPPS_MSN!,
                'Content-Type': 'application/json',
                'Vipps-System-Name': 'Moller Fanclub',
                'Vipps-System-Version': '1.0.0',
                'Vipps-System-Plugin-Name': 'custom-integration',
                'Vipps-System-Plugin-Version': '1.0.0',
            };

            await this.axiosInstance.post(
                `/checkout/v3/session/${reference}/expire`,
                {},
                {
                    headers,
                }
            );

            console.log(`✅ Vipps checkout session expired: ${reference}`);
        } catch (error) {
            const axiosError = error as AxiosError<VippsError>;
            console.error(`❌ Failed to expire session ${reference}:`, axiosError.response?.data || axiosError.message);
            throw this.handleError(axiosError, 'Failed to expire session');
        }
    }

    /**
     * Handle and format Vipps API errors
     */
    private handleError(error: AxiosError<VippsError>, defaultMessage: string): Error {
        if (error.response) {
            const vippsError = error.response.data;
            const message = vippsError?.error_description || vippsError?.message || vippsError?.error || defaultMessage;
            const statusCode = error.response.status;
            
            // Include detailed error information for debugging
            let errorDetails = `Vipps API Error (${statusCode}): ${message}`;
            
            // Add validation errors if present
            if (vippsError && typeof vippsError === 'object' && 'errors' in vippsError) {
                const validationErrors = (vippsError as any).errors;
                if (validationErrors && typeof validationErrors === 'object') {
                    const errorFields = Object.keys(validationErrors).join(', ');
                    errorDetails += `\nValidation errors in: ${errorFields}`;
                }
            }
            
            return new Error(errorDetails);
        }
        if (error.request) {
            return new Error(`Vipps API request failed: ${error.message}`);
        }
        return new Error(`${defaultMessage}: ${error.message}`);
    }
}

// Export singleton instance
export const vippsService = new VippsService();

