import type { Course } from "../components/types.d";

/**
 * Utility functions for handling course images and thumbnails
 */

/**
 * Get a properly formatted image URL for course thumbnails
 * @param thumbnail - The thumbnail URL from the course data
 * @returns A valid image URL or a placeholder
 */
export const getCourseImageUrl = (thumbnail?: string | null): string => {
  if (!thumbnail || thumbnail.trim() === '') {
    return 'https://placehold.co/600x400/cccccc/000000?text=No+Image';
  }

  // If it's already a full URL, return as is
  if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
    return thumbnail;
  }

  // If it's a relative path, construct the full URL
  // This handles cases where the backend returns relative paths
  const baseUrl = import.meta.env.MODE === 'development'
    ? 'http://localhost:3006'
    : 'https://alikohub.com';

  // Handle different URL formats
  if (thumbnail.startsWith('/api/')) {
    // Already has the correct path structure
    return `${baseUrl}${thumbnail}`;
  } else if (thumbnail.startsWith('/')) {
    // Remove leading slash and add api path
    return `${baseUrl}/api/academy/upload/image/${thumbnail.slice(1)}`;
  } else {
    // Just the filename, add the full path
    return `${baseUrl}/api/academy/upload/image/${thumbnail}`;
  }
};

/**
 * Get a background image style object for course cards
 * @param thumbnail - The thumbnail URL from the course data
 * @returns CSS style object with background image
 */
export const getCourseBackgroundStyle = (thumbnail?: string | null) => {
  const imageUrl = getCourseImageUrl(thumbnail);
  return {
    backgroundImage: `url('${imageUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };
};

/**
 * Check if an image URL is valid
 * @param url - The image URL to validate
 * @returns Promise<boolean> - Whether the image is accessible
 */
export const isValidImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && contentType !== null && contentType.startsWith('image/');
  } catch (error) {
    console.warn('Image URL validation failed:', url, error);
    return false;
  }
};

/**
 * Get a course image URL with fallback and error handling
 * @param thumbnail - The thumbnail URL from the course data
 * @param category - The course category for fallback
 * @returns A valid image URL with proper fallback
 */
export const getCourseImageUrlWithFallback = (thumbnail?: string | null, category?: string): string => {
  const primaryUrl = getCourseImageUrl(thumbnail);

  // If we got a placeholder, try to use a category-specific one
  if (primaryUrl.includes('placehold.co') && category) {
    return getCategoryPlaceholderImage(category);
  }

  return primaryUrl;
};

/**
 * Get a fallback image URL based on course category
 * @param category - The course category
 * @returns A category-specific placeholder image URL
 */
export const getCategoryPlaceholderImage = (category?: string): string => {
  const categoryImages: Record<string, string> = {
    'Technology': 'https://placehold.co/600x400/3B82F6/FFFFFF?text=Technology',
    'STEM': 'https://placehold.co/600x400/10B981/FFFFFF?text=STEM',
    'Health': 'https://placehold.co/600x400/EF4444/FFFFFF?text=Health',
    'Business': 'https://placehold.co/600x400/8B5CF6/FFFFFF?text=Business',
    'Arts': 'https://placehold.co/600x400/F59E0B/FFFFFF?text=Arts',
    'Default': 'https://placehold.co/600x400/6B7280/FFFFFF?text=Course'
  };

  return categoryImages[category || 'Default'] || categoryImages['Default'];
};

/**
 * Process course data to ensure thumbnail URLs are properly formatted
 * @param course - The course object to process
 * @returns The course with properly formatted thumbnail URL
 */
export const processCourseThumbnail = (course: Course): Course => {
  if (course.thumbnail) {
    return {
      ...course,
      thumbnail: getCourseImageUrl(course.thumbnail)
    };
  }
  return course;
};

/**
 * Process an array of courses to ensure all thumbnail URLs are properly formatted
 * @param courses - Array of course objects to process
 * @returns Array of courses with properly formatted thumbnail URLs
 */
export const processCourseThumbnails = (courses: Course[]): Course[] => {
  return courses.map(processCourseThumbnail);
};