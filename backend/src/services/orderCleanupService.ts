import { databaseService } from './databaseService.js';

/**
 * Cleanup service for abandoned orders
 * Marks PENDING orders older than a certain time as CANCELLED
 */
export class OrderCleanupService {
    /**
     * Mark old PENDING orders as CANCELLED
     * @param maxAgeHours - Maximum age in hours before marking as cancelled (default: 24 hours)
     */
    async cleanupAbandonedOrders(maxAgeHours: number = 24): Promise<{
        cancelled: number;
        errors: number;
    }> {
        try {
            // Get all PENDING orders
            const orders = await databaseService.getAllOrders(1000, 0);
            const pendingOrders = orders.filter(
                (order: any) => order.status === 'PENDING' || order.status === 'PAYMENT_PENDING'
            );

            const cutoffTime = new Date();
            cutoffTime.setHours(cutoffTime.getHours() - maxAgeHours);

            let cancelled = 0;
            let errors = 0;

            for (const order of pendingOrders) {
                try {
                    const orderDate = new Date(order.createdAt);
                    if (orderDate < cutoffTime) {
                        // Order is older than maxAgeHours, mark as cancelled
                        await databaseService.updateOrderStatus(order.reference, 'CANCELLED' as any);
                        cancelled++;
                        console.log(`✅ Marked abandoned order ${order.reference} as CANCELLED`);
                    }
                } catch (error) {
                    console.error(`❌ Error cancelling order ${order.reference}:`, error);
                    errors++;
                }
            }

            return { cancelled, errors };
        } catch (error) {
            console.error('❌ Error in order cleanup:', error);
            throw error;
        }
    }

    /**
     * Get statistics about abandoned orders
     */
    async getAbandonedOrderStats(maxAgeHours: number = 24): Promise<{
        totalPending: number;
        abandoned: number;
        recent: number;
    }> {
        try {
            const orders = await databaseService.getAllOrders(1000, 0);
            const pendingOrders = orders.filter(
                (order: any) => order.status === 'PENDING' || order.status === 'PAYMENT_PENDING'
            );

            const cutoffTime = new Date();
            cutoffTime.setHours(cutoffTime.getHours() - maxAgeHours);

            let abandoned = 0;
            let recent = 0;

            for (const order of pendingOrders) {
                const orderDate = new Date(order.createdAt);
                if (orderDate < cutoffTime) {
                    abandoned++;
                } else {
                    recent++;
                }
            }

            return {
                totalPending: pendingOrders.length,
                abandoned,
                recent,
            };
        } catch (error) {
            console.error('❌ Error getting abandoned order stats:', error);
            throw error;
        }
    }
}

export const orderCleanupService = new OrderCleanupService();

