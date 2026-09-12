/**
 * Image Utilities and Guaranteed Fallbacks
 * Curated high-resolution Unsplash images for luxury hotels and suites
 */

export const DEFAULT_HOTEL_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
export const DEFAULT_ROOM_IMAGE = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

/**
 * Handle image loading error gracefully with fallback image
 * Prevents infinite error loops if fallback itself has issues
 */
export const handleImageError = (event, fallbackSrc = DEFAULT_HOTEL_IMAGE) => {
  if (event && event.currentTarget) {
    event.currentTarget.onerror = null; // Prevent loop
    event.currentTarget.src = fallbackSrc;
  }
};
