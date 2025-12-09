import { databaseService } from './databaseService.js';

/**
 * Cleanup service for abandoned orders
 * Marks PENDING orders older than a certain time as TERMINATED and expires their Vipps sessions
 */
export class OrderCleanupService {
    /**
     * Mark old PENDING orders as TERMINATED
     * @param maxAgeMinutes - Maximum age in minutes before marking as terminated (default: 10 minutes)
     */
    async cleanupAbandonedOrders(maxAgeMinutes: number = 10): Promise<{
        terminated: number;
        errors: number;
    }> {
        try {
            // Get all PENDING orders
            const orders = await databaseService.getAllOrders(1000, 0);
            const pendingOrders = orders.filter(
                (order: any) => order.status === 'PENDING' || order.status === 'PAYMENT_PENDING'
            );

            const cutoffTime = new Date();
            cutoffTime.setMinutes(cutoffTime.getMinutes() - maxAgeMinutes);

            let terminated = 0;
            let errors = 0;

            for (const order of pendingOrders) {
                try {
                    const orderDate = new Date(order.createdAt);
                    if (orderDate < cutoffTime) {
   
                        
                        await databaseService.updateOrderStatus(order.reference, 'TERMINATED' as any);
                        terminated++;
                        console.log(`✅ Marked abandoned order ${order.reference} as TERMINATED`);
                    }
                } catch (error) {
                    console.error(`❌ Error terminating order ${order.reference}:`, error);
                    errors++;
                }
            }

            return { terminated, errors };
        } catch (error) {
            console.error('❌ Error in order cleanup:', error);
            throw error;
        }
    }

    /**
     * Get statistics about abandoned orders
     */
    async getAbandonedOrderStats(maxAgeMinutes: number = 10): Promise<{
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
            cutoffTime.setMinutes(cutoffTime.getMinutes() - maxAgeMinutes);

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

