/**
 * Shared utility functions for the KITS Inventory System
 */

/**
 * Returns a stock status object based on quantity
 */
export const getStockStatus = (qty) => {
  if (qty <= 5)  return { label: 'CRITICAL', color: 'bg-red-100 text-red-700 border-red-200' };
  if (qty <= 15) return { label: 'LOW',      color: 'bg-amber-100 text-amber-700 border-amber-200' };
  return           { label: 'OPTIMAL',  color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
};

/**
 * Returns a time-based greeting string
 */
export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Safely converts a Firestore timestamp to a locale date string
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now';
  // Check for Firestore Timestamp object
  if (timestamp.toDate) return timestamp.toDate().toLocaleDateString();
  // Check for Date object
  if (timestamp instanceof Date) return timestamp.toLocaleDateString();
  // Check for ISO string or seconds
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString();
  return new Date(timestamp).toLocaleDateString();
};
