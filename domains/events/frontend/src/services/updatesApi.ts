import { apiClient } from './apiClient';
import type { 
  Update, 
  ApiResponse
} from '../types/api';

/**
 * Updates/News API Service
 * Handles all news and updates-related API calls based on AlikoEvent API Documentation
 */
export class UpdatesApiService {
  
  /**
   * Get all news and updates
   * GET /updates
   */
  static async getUpdates(): Promise<ApiResponse<Update[]>> {
    return apiClient.get<Update[]>('/updates', false); // Public endpoint, no auth required
  }

  /**
   * Get updates for a specific event
   * This is a client-side filter since the API doesn't have a specific endpoint for this
   */
  static async getEventUpdates(eventId: string): Promise<ApiResponse<Update[]>> {
    const response = await this.getUpdates();
    
    if (!response.success || !response.data) {
      return response;
    }

    const eventUpdates = response.data.filter(update => 
      update.eventId === eventId
    );

    return {
      data: eventUpdates,
      success: true,
    };
  }

  /**
   * Get latest updates (most recent first)
   */
  static async getLatestUpdates(limit: number = 5): Promise<ApiResponse<Update[]>> {
    const response = await this.getUpdates();
    
    if (!response.success || !response.data) {
      return response;
    }

    // Sort by posted_at date (most recent first) and limit results
    const sortedUpdates = response.data
      .sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime())
      .slice(0, limit);

    return {
      data: sortedUpdates,
      success: true,
    };
  }

  /**
   * Search updates by title or content
   */
  static async searchUpdates(query: string): Promise<ApiResponse<Update[]>> {
    const response = await this.getUpdates();
    
    if (!response.success || !response.data) {
      return response;
    }

    const filteredUpdates = response.data.filter(update => 
      update.title.toLowerCase().includes(query.toLowerCase()) ||
      update.content.toLowerCase().includes(query.toLowerCase())
    );

    return {
      data: filteredUpdates,
      success: true,
    };
  }

  /**
   * Get update by ID
   */
  static async getUpdateById(updateId: string): Promise<ApiResponse<Update | null>> {
    const response = await this.getUpdates();
    
    if (!response.success || !response.data) {
      return {
        data: null,
        success: response.success,
        error: response.error,
      };
    }

    const update = response.data.find(u => u.id === updateId);
    
    return {
      data: update || null,
      success: true,
    };
  }

  /**
   * Format update date for display
   */
  static formatUpdateDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInHours < 24) {
        if (diffInHours < 1) {
          const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
          return `${diffInMinutes} minutes ago`;
        }
        const hours = Math.floor(diffInHours);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      } else if (diffInDays < 7) {
        const days = Math.floor(diffInDays);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    } catch {
      return dateString;
    }
  }

  /**
   * Truncate update content for preview
   */
  static truncateContent(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) {
      return content;
    }
    
    return content.substring(0, maxLength).trim() + '...';
  }
}

export default UpdatesApiService;