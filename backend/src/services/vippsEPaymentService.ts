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
    state: 'INITIATED' | 'RESERVED' | 'CAPTURED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
    amount: {
        currency: string;
        value: number;
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
    amount: {
        currency: string;
        value: number;
    };
    transactionText?: string;
}

export class VippsEPaymentService {
    private axiosInstance: AxiosInstance;

    constructor() {
        // Validate required environment variables
        if (!VIPPS_SUBSCRIPTION_KEY || !VIPPS_MSN) {
            throw new Error('Missing required Vipps environment variables. Please check your .env file.');
        }

        this.axiosInstance = axios.create({
            baseURL: VIPPS_API_BASE_URL,
            timeout: REQUEST_TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Get payment details by reference
     */
    async getPaymentDetails(reference: string): Promise<PaymentDetails> {
        try {
            // Get access token from vippsService
            const token = await vippsService.getAccessToken();

            const response = await this.axiosInstance.get<PaymentDetails>(
                `/epayment/v1/payments/${reference}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Ocp-Apim-Subscription-Key': VIPPS_SUBSCRIPTION_KEY!,
                        'Merchant-Serial-Number': VIPPS_MSN!,
                        // System headers (required by Vipps)
                        'Vipps-System-Name': 'Moller Fanclub',
                        'Vipps-System-Version': '1.0.0',
                        'Vipps-System-Plugin-Name': 'custom-integration',
                        'Vipps-System-Plugin-Version': '1.0.0',
                    },
                }
            );

            return response.data;
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
        try {
            // Get access token from vippsService
            const token = await vippsService.getAccessToken();

            const response = await this.axiosInstance.post<PaymentDetails>(
                `/epayment/v1/payments/${reference}/capture`,
                captureData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Ocp-Apim-Subscription-Key': VIPPS_SUBSCRIPTION_KEY!,
                        'Merchant-Serial-Number': VIPPS_MSN!,
                        // System headers (required by Vipps)
                        'Vipps-System-Name': 'Moller Fanclub',
                        'Vipps-System-Version': '1.0.0',
                        'Vipps-System-Plugin-Name': 'custom-integration',
                        'Vipps-System-Plugin-Version': '1.0.0',
                    },
                }
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
        try {
            // Get access token from vippsService
            const token = await vippsService.getAccessToken();

            const cancelData: { transactionText?: string } = {};
            if (transactionText) {
                cancelData.transactionText = transactionText;
            }

            const response = await this.axiosInstance.post<PaymentDetails>(
                `/epayment/v1/payments/${reference}/cancel`,
                cancelData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Ocp-Apim-Subscription-Key': VIPPS_SUBSCRIPTION_KEY!,
                        'Merchant-Serial-Number': VIPPS_MSN!,
                        // System headers (required by Vipps)
                        'Vipps-System-Name': 'Moller Fanclub',
                        'Vipps-System-Version': '1.0.0',
                        'Vipps-System-Plugin-Name': 'custom-integration',
                        'Vipps-System-Plugin-Version': '1.0.0',
                    },
                }
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
        try {
            // Get access token from vippsService
            const token = await vippsService.getAccessToken();

            const response = await this.axiosInstance.post<PaymentDetails>(
                `/epayment/v1/payments/${reference}/refund`,
                refundData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Ocp-Apim-Subscription-Key': VIPPS_SUBSCRIPTION_KEY!,
                        'Merchant-Serial-Number': VIPPS_MSN!,
                        // System headers (required by Vipps)
                        'Vipps-System-Name': 'Moller Fanclub',
                        'Vipps-System-Version': '1.0.0',
                        'Vipps-System-Plugin-Name': 'custom-integration',
                        'Vipps-System-Plugin-Version': '1.0.0',
                    },
                }
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

