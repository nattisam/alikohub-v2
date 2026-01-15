
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
 * Get a course image URL with proper fallback handling
 * @param thumbnail - The thumbnail URL from the course data
 * @returns A valid image URL with proper fallback
 */
export const getCourseImageUrl = (thumbnail?: string | null): string => {
  if (!thumbnail) {
    // Return a default placeholder image
    return 'https://placehold.co/600x400?text=No+Image';
  }
  
  // If the thumbnail is already a valid URL, return it
  if (thumbnail.startsWith('http')) {
    return thumbnail;
  }
  
  // If it's a relative path, assume it's a local asset
  // For now, return the thumbnail as is, but in a real app you might want to prepend a base URL
  return thumbnail;
};

/**
 * Get a category-specific placeholder image
 * @param category - The course category
 * @returns A placeholder image URL based on the category
 */
export const getCategoryPlaceholderImage = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'Technology': 'https://placehold.co/600x400?text=Technology+Course',
    'STEM': 'https://placehold.co/600x400?text=STEM+Course',
    'Health': 'https://placehold.co/600x400?text=Health+Course',
    'Business': 'https://placehold.co/600x400?text=Business+Course',
    'Arts': 'https://placehold.co/600x400?text=Arts+Course',
    'Science': 'https://placehold.co/600x400?text=Science+Course',
    'Mathematics': 'https://placehold.co/600x400?text=Mathematics+Course',
  };
  
  // Return the category-specific placeholder or a default one
  return categoryMap[category] || 'https://placehold.co/600x400?text=Course';
};



