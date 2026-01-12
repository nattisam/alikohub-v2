import { apiClient } from './apiClient';
import type { 
  Event,
  Attendee,
  CreateEventRequest,
  UpdateEventRequest,
  CreateUpdateRequest,
  ApiResponse
} from '../types/api';

/**
 * Admin API Service
 * Handles all organizer/admin-related API calls based on AlikoEvent API Documentation
 * All endpoints require ORGANIZER role and authentication
 */
export class AdminApiService {
  
  /**
   * Create a new event
   * POST /admin/events
   * Requires ORGANIZER role
   */
  static async createEvent(eventData: CreateEventRequest): Promise<ApiResponse<Event>> {
    return apiClient.post<Event>('/admin/events', eventData, true);
  }

  /**
   * Update an existing event
   * PUT /admin/events/{event_id}
   * Only the organizer who created the event can update it
   */
  static async updateEvent(
    eventId: string, 
    eventData: UpdateEventRequest
  ): Promise<ApiResponse<Event>> {
    return apiClient.put<Event>(`/admin/events/${eventId}`, eventData, true);
  }

  /**
   * Delete an event
   * DELETE /admin/events/{event_id}
   * Only the organizer who created the event can delete it
   */
  static async deleteEvent(eventId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/admin/events/${eventId}`, true);
  }

  /**
   * Get all events created by the current organizer
   * GET /admin/events/my-events (assuming this endpoint exists)
   */
  static async getMyEvents(): Promise<ApiResponse<Event[]>> {
    return apiClient.get<Event[]>('/admin/events/my-events', true);
  }

  /**
   * View attendees for a specific event
   * GET /admin/events/{event_id}/attendees
   * Supports export as CSV/Excel for download
   */
  static async getEventAttendees(eventId: string): Promise<ApiResponse<Attendee[]>> {
    return apiClient.get<Attendee[]>(`/admin/events/${eventId}/attendees`, true);
  }

  /**
   * Export attendees as CSV
   * GET /admin/events/{event_id}/attendees/export?format=csv
   */
  static async exportAttendees(
    eventId: string, 
    format: 'csv' | 'excel' = 'csv'
  ): Promise<ApiResponse<Blob>> {
    // For file downloads, we need to handle the response differently
    try {
      const response = await fetch(
        `${apiClient.apiBaseUrl}/admin/events/${eventId}/attendees/export?format=${format}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('alikohub_auth_token')}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        return {
          data: blob,
          success: true,
        };
      } else {
        return {
          error: {
            error: 'Export failed',
            statusCode: response.status,
          },
          success: false,
        };
      }
    } catch (error) {
      return {
        error: {
          error: 'Export failed',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        success: false,
      };
    }
  }

  /**
   * Download attendees file
   */
  static downloadAttendeesFile(blob: Blob, eventTitle: string, format: 'csv' | 'excel'): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${eventTitle}_attendees.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Post a new update/announcement
   * POST /admin/updates
   * Allows an organizer to publish a public announcement
   */
  static async postUpdate(updateData: CreateUpdateRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/admin/updates', updateData, true);
  }

  /**
   * Get updates posted by the current organizer
   * GET /admin/updates/my-updates (assuming this endpoint exists)
   */
  static async getMyUpdates(): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>('/admin/updates/my-updates', true);
  }

  /**
   * Update an existing announcement
   * PUT /admin/updates/{update_id} (assuming this endpoint exists)
   */
  static async updateAnnouncement(
    updateId: string, 
    updateData: CreateUpdateRequest
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put<{ message: string }>(`/admin/updates/${updateId}`, updateData, true);
  }

  /**
   * Delete an update/announcement
   * DELETE /admin/updates/{update_id} (assuming this endpoint exists)
   */
  static async deleteUpdate(updateId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/admin/updates/${updateId}`, true);
  }

  /**
   * Get event statistics
   * GET /admin/events/{event_id}/stats (assuming this endpoint exists)
   */
  static async getEventStats(eventId: string): Promise<ApiResponse<{
    totalAttendees: number;
    registrationRate: number;
    recentRegistrations: number;
  }>> {
    return apiClient.get(`/admin/events/${eventId}/stats`, true);
  }

  /**
   * Get dashboard overview
   * GET /admin/dashboard (assuming this endpoint exists)
   */
  static async getDashboardOverview(): Promise<ApiResponse<{
    totalEvents: number;
    totalAttendees: number;
    upcomingEvents: number;
    recentActivity: any[];
  }>> {
    return apiClient.get('/admin/dashboard', true);
  }

  /**
   * Validate event data before submission
   */
  static validateEventData(eventData: CreateEventRequest | UpdateEventRequest): string[] {
    const errors: string[] = [];

    if (!eventData.title?.trim()) {
      errors.push('Event title is required');
    }

    if (!eventData.description?.trim()) {
      errors.push('Event description is required');
    }

    if (!eventData.date) {
      errors.push('Event date is required');
    } else {
      const eventDate = new Date(eventData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        errors.push('Event date cannot be in the past');
      }
    }

    if (!eventData.time) {
      errors.push('Event time is required');
    }

    if (!eventData.location?.trim()) {
      errors.push('Event location is required');
    }

    return errors;
  }

  /**
   * Format event data for API submission
   */
  static formatEventData(eventData: CreateEventRequest | UpdateEventRequest): CreateEventRequest | UpdateEventRequest {
    return {
      ...eventData,
      title: eventData.title.trim(),
      description: eventData.description.trim(),
      location: eventData.location.trim(),
    };
  }
}

export default AdminApiService;