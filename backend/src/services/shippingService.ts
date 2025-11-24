import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Posten/Bring API Configuration
const BRING_API_BASE_URL = 'https://api.bring.com/shippingguide/v2';
const BRING_API_UID = process.env.BRING_API_UID; // API UID (username/email)
const BRING_API_KEY = process.env.BRING_API_KEY; // API Key
const BRING_CUSTOMER_NUMBER = process.env.BRING_CUSTOMER_NUMBER;

// Default sender address (your shop address)
const DEFAULT_SENDER_POSTAL_CODE = process.env.SENDER_POSTAL_CODE || '0001'; // Oslo
const DEFAULT_SENDER_COUNTRY = 'NO';

// Request timeout
const REQUEST_TIMEOUT = 10000; // 10 seconds

export interface ShippingOption {
    priority: number;
    amount: number; // in øre
    description: string;
    vippsLogistics?: {
        product: string;
        service: string;
    };
}

export interface ShippingRequest {
    postalCode: string;
    country?: string;
    weight?: number; // in grams
    volume?: number; // in liters
}

export class ShippingService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: BRING_API_BASE_URL,
            timeout: REQUEST_TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Get shipping options from Posten/Bring based on destination
     */
    async getShippingOptions(request: ShippingRequest): Promise<ShippingOption[]> {
        // If API credentials are not configured, return default options
        if (!BRING_API_UID || !BRING_API_KEY || !BRING_CUSTOMER_NUMBER) {
            console.warn('⚠️  Posten/Bring API credentials not configured. Using default shipping options.');
            if (!BRING_API_UID) console.warn('   Missing: BRING_API_UID');
            if (!BRING_API_KEY) console.warn('   Missing: BRING_API_KEY');
            if (!BRING_CUSTOMER_NUMBER) console.warn('   Missing: BRING_CUSTOMER_NUMBER');
            return this.getDefaultShippingOptions();
        }

        try {
            const postalCode = request.postalCode.replace(/\s/g, ''); // Remove spaces
            const country = request.country || 'NO';
            const weight = request.weight || 2000; // Default 2kg
            const volume = request.volume || 5; // Default 5L

            // Posten/Bring Shipping Guide API v2 request
            // Documentation: https://developer.bring.com/api/shipping-guide_2/
            const params = {
                clientUrl: 'https://mollerfan.club',
                from: {
                    postalCode: DEFAULT_SENDER_POSTAL_CODE,
                    country: DEFAULT_SENDER_COUNTRY,
                },
                to: {
                    postalCode,
                    country,
                },
                weightInGrams: weight,
                volumeInLiters: volume,
                // Request specific services
                products: [
                    'SERVICEPAKKE', // Posten Servicepakke (standard)
                    'PA_DOREN', // Posten på døren
                    'BPAKKE_DOR-DOR', // Bring B-pakke dør-dør
                    'EKSPRESS09', // Bring Ekspress09
                ],
            };

            // Note: Bring API uses X-MyBring-API-Uid (username/email) and X-MyBring-API-Key (API key) for authentication
            // These are two different values from your Mybring account
            const response = await this.axiosInstance.post(
                '/products',
                params,
                {
                    headers: {
                        'X-MyBring-API-Uid': BRING_API_UID!,
                        'X-MyBring-API-Key': BRING_API_KEY!,
                    },
                }
            );

            // Parse response and convert to Vipps format
            const options: ShippingOption[] = [];
            const products = response.data?.products || [];

            // Map Posten/Bring products to shipping options
            products.forEach((product: any, index: number) => {
                if (product.price && product.expectedDelivery) {
                    const priceInOre = Math.round(product.price.netMonetaryAmount * 100); // Convert to øre
                    const deliveryTime = product.expectedDelivery.workingDays || 1;
                    
                    let description = product.displayName || product.productName;
                    if (deliveryTime) {
                        description += ` (${deliveryTime} ${deliveryTime === 1 ? 'virkedag' : 'virkedager'})`;
                    }

                    options.push({
                        priority: index + 1,
                        amount: priceInOre,
                        description,
                        vippsLogistics: {
                            product: product.productId || product.productCode,
                            service: product.serviceId || 'STANDARD',
                        },
                    });
                }
            });

            // If no options found, return defaults
            if (options.length === 0) {
                console.warn('⚠️  No shipping options found from Posten/Bring. Using default options.');
                return this.getDefaultShippingOptions();
            }

            // Sort by priority (price ascending)
            options.sort((a, b) => a.amount - b.amount);

            return options;
        } catch (error: any) {
            console.error('❌ Error fetching shipping options from Posten/Bring:', error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            // Fallback to default options on error
            return this.getDefaultShippingOptions();
        }
    }

    /**
     * Get default shipping options (fallback when API is not available)
     */
    getDefaultShippingOptions(): ShippingOption[] {
        return [
            {
                priority: 1,
                amount: 7900, // 79 kr in øre
                description: 'Posten Servicepakke (3-5 virkedager)',
                vippsLogistics: {
                    product: 'SERVICEPAKKE',
                    service: 'STANDARD',
                },
            },
            {
                priority: 2,
                amount: 14900, // 149 kr in øre
                description: 'Posten på døren (1-2 virkedager)',
                vippsLogistics: {
                    product: 'PA_DOREN',
                    service: 'EXPRESS',
                },
            },
        ];
    }

    /**
     * Check if Posten/Bring API is configured
     */
    isConfigured(): boolean {
        return !!(BRING_API_UID && BRING_API_KEY && BRING_CUSTOMER_NUMBER);
    }
}

export const shippingService = new ShippingService();

