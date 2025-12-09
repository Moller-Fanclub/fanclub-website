import axios, { AxiosInstance, AxiosError } from 'axios';
import dotenv from 'dotenv';
import { vippsService } from './vippsService.js';

dotenv.config();


// Vipps API Configuration
const VIPPS_API_BASE_URL = process.env.VIPPS_API_BASE_URL || 'https://apitest.vipps.no';
const VIPPS_SUBSCRIPTION_KEY = process.env.VIPPS_SUBSCRIPTION_KEY;
const VIPPS_MSN = process.env.VIPPS_MSN;

// Request timeout (30 seconds)
const REQUEST_TIMEOUT = 30000;

// Types
interface VippsError {
    error?: string;
    error_description?: string;
    errorCode?: string;
    message?: string;
}

export interface PaymentDetails {
    state: 'INITIATED' | 'AUTHORIZED' | 'RESERVED' | 'CAPTURED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'TERMINATED';
    amount: {
        currency: string;
        value: number;
    };
    aggregate: {
        authorizedAmount: {
            currency: string;
            value: number;
        };
        capturedAmount: {
            currency: string;
            value: number;
        };
        refundedAmount: {
            currency: string;
            value: number;
        };
        cancelledAmount: {
            currency: string;
            value: number;
        };
    };
    transaction: {
        reference: string;
        paymentProduct: string;
    };
    paymentMethod?: {
        type: string;
    };
    summary?: {
        reservedAmount?: number;
        capturedAmount?: number;
        refundedAmount?: number;
        remainingAmountToCapture?: number;
        remainingAmountToRefund?: number;
    };
}

export interface CaptureRequest {
    modificationAmount: {
        currency: string;
        value: number;
    };
    transactionText?: string;
}

export interface RefundRequest {
    modificationAmount: {
        currency: string;
        value: number;
    };
    transactionText?: string;
}

export class VippsEPaymentService {
    private axiosInstance: AxiosInstance | null = null;
    private isConfigured: boolean = false;

    constructor() {
        // Validate required environment variables
        const missingVars: string[] = [];
        if (!VIPPS_SUBSCRIPTION_KEY) missingVars.push('VIPPS_SUBSCRIPTION_KEY');
        if (!VIPPS_MSN) missingVars.push('VIPPS_MSN');

        if (missingVars.length > 0) {
            console.warn('⚠️  Vipps ePayment service not configured. Missing environment variables:');
            missingVars.forEach(v => console.warn(`   - ${v}`));
            console.warn('   Vipps ePayment functionality (capture, refund) will not be available.');
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
     * Get shared request headers for Vipps ePayment API calls
     */
    private async getRequestHeaders(): Promise<Record<string, string>> {
        // Get access token from vippsService
        const token = await vippsService.getAccessToken();

        return {
            'Authorization': `Bearer ${token}`,
            'Ocp-Apim-Subscription-Key': VIPPS_SUBSCRIPTION_KEY!,
            'Merchant-Serial-Number': VIPPS_MSN!,
            // System headers (required by Vipps)
            'Vipps-System-Name': 'Moller Fanclub',
            'Vipps-System-Version': '1.0.0',
            'Vipps-System-Plugin-Name': 'custom-integration',
            'Vipps-System-Plugin-Version': '1.0.0',
        };
    }

    /**
     * Get payment details by reference
     */
    async getPaymentDetails(reference: string): Promise<PaymentDetails> {
        if (!this.isConfigured || !this.axiosInstance) {
            throw new Error('Vipps ePayment service is not configured. Please set required environment variables.');
        }

        try {
            const response = await this.axiosInstance.get<PaymentDetails>(
                `/epayment/v1/payments/${reference}`,
                {
                    headers: await this.getRequestHeaders(),
                }
            );

            // Determine actual state from aggregate amounts
            const paymentDetails = response.data;
            
    
            const { capturedAmount, refundedAmount, cancelledAmount, authorizedAmount } = paymentDetails.aggregate;
            
            // If captured amount > 0, payment is captured
            if (capturedAmount.value > 0) {
                if (refundedAmount.value > 0) {
                    paymentDetails.state = refundedAmount.value >= capturedAmount.value ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
                } else {
                    paymentDetails.state = 'CAPTURED';
                }
            }
            // If cancelled amount > 0, payment is cancelled
            else if (cancelledAmount.value > 0) {
                paymentDetails.state = 'CANCELLED';
            }
            // If authorized amount > 0 but not captured, payment is reserved
            else if (authorizedAmount.value > 0) {
                paymentDetails.state = 'RESERVED';
            }
            // Otherwise use the state from API (INITIATED, TERMINATED, etc.)
        
            
            return paymentDetails;
        } catch (error) {
            const axiosError = error as AxiosError<VippsError>;
            console.error(`❌ Failed to get payment details for ${reference}:`, axiosError.response?.data || axiosError.message);
            throw this.handleError(axiosError, 'Failed to get payment details');
        }
    }

    /**
     * Capture a reserved payment
     * This completes the payment and transfers funds to merchant
     */
    async capturePayment(reference: string, captureData: CaptureRequest): Promise<PaymentDetails> {
        if (!this.isConfigured || !this.axiosInstance) {
            throw new Error('Vipps ePayment service is not configured. Please set required environment variables.');
        }

        try {
            const headers = await this.getRequestHeaders();
            // Add idempotency key for capture (required by Vipps)
            headers['Idempotency-Key'] = `capture-${reference}-${Date.now()}`;
            
            const response = await this.axiosInstance.post<PaymentDetails>(
                `/epayment/v1/payments/${reference}/capture`,
                captureData,
                { headers }
            );

            console.log(`✅ Captured payment: ${reference}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<VippsError>;
            console.error(`❌ Failed to capture payment ${reference}:`, axiosError.response?.data || axiosError.message);
            throw this.handleError(axiosError, 'Failed to capture payment');
        }
    }

    /**
     * Cancel a reserved payment
     * This releases the reservation without charging the customer
     */
    async cancelPayment(reference: string, transactionText?: string): Promise<PaymentDetails> {
        if (!this.isConfigured || !this.axiosInstance) {
            throw new Error('Vipps ePayment service is not configured. Please set required environment variables.');
        }

        try {
            const cancelData: { transactionText?: string } = {};
            if (transactionText) {
                cancelData.transactionText = transactionText;
            }

            const headers = await this.getRequestHeaders();
            // Add idempotency key for cancel (required by Vipps)
            headers['Idempotency-Key'] = `cancel-${reference}-${Date.now()}`;

            const response = await this.axiosInstance.post<PaymentDetails>(
                `/epayment/v1/payments/${reference}/cancel`,
                cancelData,
                { headers }
            );

            console.log(`✅ Cancelled payment: ${reference}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<VippsError>;
            console.error(`❌ Failed to cancel payment ${reference}:`, axiosError.response?.data || axiosError.message);
            throw this.handleError(axiosError, 'Failed to cancel payment');
        }
    }

    /**
     * Refund a captured payment
     * Can be full or partial refund
     */
    async refundPayment(reference: string, refundData: RefundRequest): Promise<PaymentDetails> {
        if (!this.isConfigured || !this.axiosInstance) {
            throw new Error('Vipps ePayment service is not configured. Please set required environment variables.');
        }

        try {
            const headers = await this.getRequestHeaders();
            // Add idempotency key for refund (required by Vipps)
            headers['Idempotency-Key'] = `refund-${reference}-${Date.now()}`;
            
            const response = await this.axiosInstance.post<PaymentDetails>(
                `/epayment/v1/payments/${reference}/refund`,
                refundData,
                { headers }
            );

            console.log(`✅ Refunded payment: ${reference}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<VippsError>;
            console.error(`❌ Failed to refund payment ${reference}:`, axiosError.response?.data || axiosError.message);
            throw this.handleError(axiosError, 'Failed to refund payment');
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
            return new Error(`Vipps API Error (${statusCode}): ${message}`);
        }
        if (error.request) {
            return new Error(`Vipps API request failed: ${error.message}`);
        }
        return new Error(`${defaultMessage}: ${error.message}`);
    }
}

// Export singleton instance
export const vippsEPaymentService = new VippsEPaymentService();

