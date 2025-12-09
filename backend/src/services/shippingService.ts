import axios, { AxiosInstance } from 'axios';

// Environment variables
const BRING_API_UID = process.env.BRING_API_UID;
const BRING_API_KEY = process.env.BRING_API_KEY;
const BRING_CUSTOMER_NUMBER = process.env.BRING_CUSTOMER_NUMBER;
const DEFAULT_SENDER_POSTAL_CODE = process.env.SENDER_POSTAL_CODE || '0001';
const DEFAULT_SENDER_COUNTRY = 'NO'; // Norway

export interface ShippingRequest {
    postalCode: string;
    country: string;
    weight?: number; // in grams
    volume?: number; // in cm³
    address?: string;
}

export interface ShippingOption {
    id: string;
    priority: number;
    amount: {
        value: number; // in øre
        currency: string;
    };
    title: string; // Required by Vipps API
    description: string;
    brand: 'POSTEN' | 'BRING' | 'OTHER';
    isDefault: boolean;
    vippsLogistics?: {
        product: string;
        service: string;
    };
}

export class ShippingService {
    private axiosInstance: AxiosInstance | null = null;

    constructor() {
        if (this.isConfigured()) {
            this.axiosInstance = axios.create({
                baseURL: 'https://api.bring.com',
                headers: {
                    'X-MyBring-API-Uid': BRING_API_UID!,
                    'X-MyBring-API-Key': BRING_API_KEY!,
                },
            });
        } else {
            console.warn('⚠️  Bring API not configured. Address validation will be limited.');
        }
    }

    /**
     * Check if Bring API is configured
     */
    isConfigured(): boolean {
        return !!(BRING_API_UID && BRING_API_KEY && BRING_CUSTOMER_NUMBER);
    }

    /**
     * Validate if shipping is possible to the given address
     * Returns true if address is valid (in Norway and deliverable), false otherwise
     */
    async validateAddress(postalCode: string, country: string): Promise<boolean> {
        // Only allow shipping to Norway
        if (country !== 'NO' && country !== 'NOR') {
            console.log(`❌ Shipping validation failed: Country ${country} is not Norway`);
            return false;
        }

        // If Bring API is not configured, we can't validate, so allow it
        // (graceful degradation for development)
        if (!this.isConfigured() || !this.axiosInstance) {
            console.warn('⚠️  Bring API not configured - skipping address validation');
            return true;
        }

        try {
            // Validate postal code format (Norwegian postal codes are 4 digits)
            const postalCodeRegex = /^\d{4}$/;
            if (!postalCodeRegex.test(postalCode)) {
                console.log(`❌ Shipping validation failed: Invalid postal code format: ${postalCode}`);
                return false;
            }

            // Try to get shipping options for this address
            // If Bring API returns options, the address is valid
            // Bring API v2 expects flat parameters, not nested objects
            const response = await this.axiosInstance.get('/shippingguide/v2/products', {
                params: {
                    clientUrl: 'https://mollerfan.club',
                    frompostalcode: DEFAULT_SENDER_POSTAL_CODE,
                    fromcountry: DEFAULT_SENDER_COUNTRY,
                    topostalcode: postalCode,
                    tocountry: country,
                    weight: 1000, // Use a default weight for validation (in grams)
                    customers: BRING_CUSTOMER_NUMBER, // Single customer number, not array
                },
            });

            // Check if we got any valid shipping products
            const products = response.data?.products || [];
            const hasValidProducts = products.length > 0 && 
                products.some((product: any) => 
                    product.productId && 
                    !product.errors && 
                    !product.warnings
                );

            if (hasValidProducts) {
                console.log(`✅ Shipping validation passed for postal code: ${postalCode}`);
                return true;
            } else {
                console.log(`❌ Shipping validation failed: No valid shipping products for postal code: ${postalCode}`);
                return false;
            }
        } catch (error: any) {
            // If API call fails, reject the address to be safe
            // This ensures we don't accept addresses we can't verify
            console.error(`❌ Error validating address with Bring API (rejecting address):`, error.response?.data || error.message);
            // Reject the address if we can't validate it
            return false;
        }
    }

    /**
     * Get shipping options from Bring API
     * This method is kept for future use but is currently commented out in the callback
     * 
     * To use dynamic pricing, uncomment the call to this method in vippsRoutes.ts
     * and comment out the fixed price option.
     */
    async getShippingOptions(request: ShippingRequest): Promise<ShippingOption[]> {
        if (!this.isConfigured() || !this.axiosInstance) {
            console.warn('⚠️  Bring API not configured - returning default options');
            return this.getDefaultShippingOptions();
        }

        try {
            // Bring API v2 expects flat parameters
            const params: any = {
                clientUrl: 'https://mollerfan.club',
                frompostalcode: DEFAULT_SENDER_POSTAL_CODE,
                fromcountry: DEFAULT_SENDER_COUNTRY,
                topostalcode: request.postalCode,
                tocountry: request.country,
                customers: BRING_CUSTOMER_NUMBER,
            };

            // Add weight or volume (at least one is required)
            if (request.weight) {
                params.weight = request.weight;
            } else if (request.volume) {
                params.volumeindm3 = request.volume / 1000; // Convert cm³ to dm³
            } else {
                params.weight = 1000; // Default weight if neither provided
            }

            const response = await this.axiosInstance.get('/shippingguide/v2/products', {
                params,
            });

            const products = response.data?.products || [];
            const shippingOptions: ShippingOption[] = [];

            // Map Bring products to Vipps shipping options
            for (const product of products) {
                if (product.errors || product.warnings) {
                    continue; // Skip products with errors
                }

                const productId = product.productId;
                const price = product.price?.listPrice?.withoutVAT || product.price?.listPrice?.withVAT || 0;
                const priceInOre = Math.round(price * 100); // Convert to øre

                // Map Bring product IDs to Vipps brands and products
                let brand: 'POSTEN' | 'BRING' = 'POSTEN';
                let vippsProduct = productId;
                let description = product.productNameInCustomerLanguage || productId;

                if (productId === 'SERVICEPAKKE') {
                    brand = 'POSTEN';
                    vippsProduct = 'SERVICEPAKKE';
                    description = 'Posten Servicepakke';
                } else if (productId === 'PA_DOREN') {
                    brand = 'POSTEN';
                    vippsProduct = 'PA_DOREN';
                    description = 'Posten på døren';
                } else if (productId === 'BPAKKE_DOR-DOR') {
                    brand = 'BRING';
                    vippsProduct = 'BPAKKE_DOR-DOR';
                    description = 'Bring B-pakke dør-dør';
                } else if (productId === 'EKSPRESS09') {
                    brand = 'BRING';
                    vippsProduct = 'EKSPRESS09';
                    description = 'Bring Ekspress09';
                }

                shippingOptions.push({
                    id: `bring-${productId.toLowerCase()}`,
                    priority: shippingOptions.length + 1,
                    amount: {
                        value: priceInOre,
                        currency: 'NOK',
                    },
                    title: description, // Use description as title for dynamic options
                    description,
                    brand,
                    isDefault: shippingOptions.length === 0,
                    vippsLogistics: {
                        product: vippsProduct,
                        service: 'STANDARD',
                    },
                });
            }

            if (shippingOptions.length > 0) {
                return shippingOptions;
            }

            // Fallback to default if no options found
            return this.getDefaultShippingOptions();
        } catch (error: any) {
            console.error('❌ Error fetching shipping options from Bring API:', error.response?.data || error.message);
            return this.getDefaultShippingOptions();
        }
    }

    /**
     * Get default fixed shipping options
     * Includes pickup option and standard shipping
     */
    getDefaultShippingOptions(): ShippingOption[] {
        return [
            {
                id: 'pickup-haldens-gate',
                priority: 0, // Higher priority (lower number) - appears first
                amount: {
                    value: 0, // 0 kr - free pickup
                    currency: 'NOK',
                },
                title: 'Hent i butikk',
                description: 'Hent på Haldens Gate 15, 7014 Trondheim',
                brand: 'OTHER', // Use "OTHER" for in-store pickup (not a Posten service)
                isDefault: false,
            },
            {
                id: 'servicepakke-standard',
                priority: 1,
                amount: {
                    value: 9900, // 99 kr in øre
                    currency: 'NOK',
                },
                title: 'Posten Servicepakke',
                description: 'Posten Servicepakke - Alle bestillinger sendes ut samtidig',
                brand: 'POSTEN',
                isDefault: true,
                vippsLogistics: {
                    product: 'SERVICEPAKKE',
                    service: 'STANDARD',
                },
            },
        ];
    }
}

// Export singleton instance
export const shippingService = new ShippingService();


