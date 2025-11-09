// Database service using Prisma ORM
// Note: Run 'npx prisma generate' after setting up DATABASE_URL

import dotenv from 'dotenv';

// Load environment variables (in case this module is loaded before dotenv.config() is called)
dotenv.config();

let PrismaClient: any;
let OrderStatus: any;

// Try to import Prisma (will fail if not generated yet)
// Use dynamic import for ES modules compatibility
(async () => {
    try {
        // Dynamic import for ES modules (since package.json has "type": "module")
        const prismaModule = await import('@prisma/client');
        if (prismaModule && prismaModule.PrismaClient) {
            PrismaClient = prismaModule.PrismaClient;
            OrderStatus = prismaModule.OrderStatus;
        } else {
            throw new Error('PrismaClient not found in module');
        }
    } catch (e: any) {
        // Prisma not available - will use fallback
        // Only warn if DATABASE_URL is set (meaning database is expected)
        // and the error is not just a module resolution issue
        if (process.env.DATABASE_URL && e?.code !== 'MODULE_NOT_FOUND') {
            console.warn('⚠️ Prisma client not available. Run: npx prisma generate');
            console.warn('   Error:', e?.message || 'Unknown error');
        }
        // Silently fall back if module not found (Prisma not installed/generated)
    }
})();

// Fallback OrderStatus enum if Prisma is not available
const OrderStatusEnum = {
    PENDING: 'PENDING',
    PAYMENT_PENDING: 'PAYMENT_PENDING',
    PAID: 'PAID',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
} as const;

type OrderStatusType = typeof OrderStatusEnum[keyof typeof OrderStatusEnum];

// Create Prisma Client instance lazily (after module is loaded)
// This ensures dynamic import completes before creating the client
let prisma: any = null;

function getPrismaClient() {
    if (!prisma && PrismaClient) {
        prisma = new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
        
        // Verify DATABASE_URL is set when Prisma Client is created
        if (!process.env.DATABASE_URL) {
            console.warn('⚠️ DATABASE_URL not set - database operations will fail');
        }
    }
    return prisma;
}

export interface CreateOrderData {
    reference: string;
    vippsSessionId?: string;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
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
    items: Array<{
        productId: string;
        productName: string;
        productImage?: string;
        size?: string;
        unitPrice: number; // in øre
        quantity: number;
        totalPrice: number; // in øre
        taxAmount: number; // in øre
    }>;
    itemsTotal: number; // in øre
    shippingPrice: number; // in øre
    totalAmount: number; // in øre
    paymentMethod?: string;
    paymentState?: string;
    amount: number; // in øre
    currency?: string;
}

export interface UpdateOrderPaymentData {
    paymentMethod?: string;
    paymentState?: string;
    status?: OrderStatusType;
    paidAt?: Date;
}

export interface UpdateOrderCustomerData {
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
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
}

export class DatabaseService {
    /**
     * Create a new order
     */
    async createOrder(data: CreateOrderData) {
        const prismaClient = getPrismaClient();
        if (!prismaClient) {
            throw new Error('Database not available. Please set DATABASE_URL and run: npx prisma generate');
        }
        return await prismaClient.order.create({
            data: {
                reference: data.reference,
                vippsSessionId: data.vippsSessionId,
                customerEmail: data.customerEmail,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                shippingFirstName: data.shippingDetails?.firstName,
                shippingLastName: data.shippingDetails?.lastName,
                shippingStreet: data.shippingDetails?.streetAddress,
                shippingPostalCode: data.shippingDetails?.postalCode,
                shippingCity: data.shippingDetails?.city,
                shippingCountry: data.shippingDetails?.country,
                billingFirstName: data.billingDetails?.firstName,
                billingLastName: data.billingDetails?.lastName,
                billingStreet: data.billingDetails?.streetAddress,
                billingPostalCode: data.billingDetails?.postalCode,
                billingCity: data.billingDetails?.city,
                billingCountry: data.billingDetails?.country,
                paymentMethod: data.paymentMethod,
                paymentState: data.paymentState,
                amount: data.amount,
                currency: data.currency || 'NOK',
                itemsTotal: data.itemsTotal,
                shippingPrice: data.shippingPrice,
                totalAmount: data.totalAmount,
                status: data.paymentState === 'AUTHORIZED' || data.paymentState === 'CAPTURED' 
                    ? (OrderStatus?.PAID || OrderStatusEnum.PAID)
                    : data.paymentState
                    ? (OrderStatus?.PAYMENT_PENDING || OrderStatusEnum.PAYMENT_PENDING)
                    : (OrderStatus?.PENDING || OrderStatusEnum.PENDING),
                paidAt: data.paymentState === 'AUTHORIZED' || data.paymentState === 'CAPTURED' 
                    ? new Date() 
                    : null,
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId,
                        productName: item.productName,
                        productImage: item.productImage,
                        size: item.size,
                        unitPrice: item.unitPrice,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice,
                        taxAmount: item.taxAmount,
                        taxPercentage: 25, // Norwegian VAT
                    })),
                },
            },
            include: {
                items: true,
            },
        });
    }

    /**
     * Get order by reference
     */
    async getOrderByReference(reference: string) {
        const prismaClient = getPrismaClient();
        if (!prismaClient) {
            throw new Error('Database not available. Please set DATABASE_URL and run: npx prisma generate');
        }
        return await prismaClient.order.findUnique({
            where: { reference },
            include: {
                items: true,
            },
        });
    }

    /**
     * Update order payment information
     */
    async updateOrderPayment(reference: string, data: UpdateOrderPaymentData) {
        const prismaClient = getPrismaClient();
        if (!prismaClient) {
            throw new Error('Database not available. Please set DATABASE_URL and run: npx prisma generate');
        }
        return await prismaClient.order.update({
            where: { reference },
            data: {
                paymentMethod: data.paymentMethod,
                paymentState: data.paymentState,
                status: data.status,
                paidAt: data.paidAt,
                updatedAt: new Date(),
            },
            include: {
                items: true,
            },
        });
    }

    /**
     * Update order status
     */
    async updateOrderStatus(reference: string, status: OrderStatusType, additionalData?: {
        shippedAt?: Date;
    }) {
        const prismaClient = getPrismaClient();
        if (!prismaClient) {
            throw new Error('Database not available. Please set DATABASE_URL and run: npx prisma generate');
        }
        return await prismaClient.order.update({
            where: { reference },
            data: {
                status,
                shippedAt: additionalData?.shippedAt,
                updatedAt: new Date(),
            },
            include: {
                items: true,
            },
        });
    }

    /**
     * Update order customer information
     */
    async updateOrderCustomer(reference: string, data: UpdateOrderCustomerData) {
        const prismaClient = getPrismaClient();
        if (!prismaClient) {
            throw new Error('Database not available. Please set DATABASE_URL and run: npx prisma generate');
        }
        return await prismaClient.order.update({
            where: { reference },
            data: {
                customerEmail: data.customerEmail,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                shippingFirstName: data.shippingDetails?.firstName,
                shippingLastName: data.shippingDetails?.lastName,
                shippingStreet: data.shippingDetails?.streetAddress,
                shippingPostalCode: data.shippingDetails?.postalCode,
                shippingCity: data.shippingDetails?.city,
                shippingCountry: data.shippingDetails?.country,
                billingFirstName: data.billingDetails?.firstName,
                billingLastName: data.billingDetails?.lastName,
                billingStreet: data.billingDetails?.streetAddress,
                billingPostalCode: data.billingDetails?.postalCode,
                billingCity: data.billingDetails?.city,
                billingCountry: data.billingDetails?.country,
                updatedAt: new Date(),
            },
            include: {
                items: true,
            },
        });
    }

    /**
     * Get orders by customer email
     */
    async getOrdersByEmail(email: string, limit: number = 50) {
        const prismaClient = getPrismaClient();
        if (!prismaClient) {
            throw new Error('Database not available. Please set DATABASE_URL and run: npx prisma generate');
        }
        return await prismaClient.order.findMany({
            where: { customerEmail: email },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                items: true,
            },
        });
    }

    /**
     * Get all orders (for admin)
     */
    async getAllOrders(limit: number = 100, offset: number = 0) {
        const prismaClient = getPrismaClient();
        if (!prismaClient) {
            throw new Error('Database not available. Please set DATABASE_URL and run: npx prisma generate');
        }
        return await prismaClient.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            include: {
                items: true,
            },
        });
    }

    /**
     * Check if order exists by reference
     */
    async orderExists(reference: string): Promise<boolean> {
        const prismaClient = getPrismaClient();
        if (!prismaClient) {
            throw new Error('Database not available. Please set DATABASE_URL and run: npx prisma generate');
        }
        const count = await prismaClient.order.count({
            where: { reference },
        });
        return count > 0;
    }
}

export const databaseService = new DatabaseService();

// Graceful shutdown
process.on('beforeExit', async () => {
    const prismaClient = getPrismaClient();
    if (prismaClient) {
        await prismaClient.$disconnect();
    }
});
