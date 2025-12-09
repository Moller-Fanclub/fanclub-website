/**
 * Shop Configuration
 * 
 * Simple configuration for shop opening times.
 * Update these dates to control when the shop is open for orders.
 * 
 * TESTING MODE: Shop is currently enabled for testing.
 * To disable, set openingDate to a future date.
 */

export const shopConfig = {
  // Testing: Shop is open (opening date in the past)
  openingDate: '2025-12-09T00:00:00',
  // Testing: Shop closes far in the future
  closingDate: '2025-12-14T23:59:59',
  
  // Production dates (commented out for testing):
  // openingDate: '2025-11-15T00:00:00',
  // closingDate: '2025-11-21T23:59:59',
};
