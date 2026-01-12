import { apiClient } from './apiClient';
import type {
  Event,
  EventSummary,
  EventRegistration,
  RegistrationResponse,
  ApiResponse,
  RoleAssignment,
  RoleAssignmentResponse,
  CreateEventRequest,
  UpdateEventRequest
} from '../types/api';

/**
 * Events API Service
 * Handles all public event-related API calls based on AlikoEvent API Documentation
 */
export class EventsApiService {

  /**
   * Get all upcoming events
   * GET /events
   */
  static async getUpcomingEvents(): Promise<ApiResponse<EventSummary[]>> {
    return apiClient.get<EventSummary[]>('/events', true); // Include auth headers
  }

  /**
   * Get detailed information about a specific event
   * GET /events/{event_id}
   */
  static async getEventDetails(eventId: string): Promise<ApiResponse<Event>> {
    return apiClient.get<Event>(`/events/${eventId}`, true); // Include auth headers
  }

  /**
   * Create a new event
   * POST /admin/events
   * Requires organizer role
   */
  static async createEvent(eventData: CreateEventRequest): Promise<ApiResponse<Event>> {
    return apiClient.post<Event>('/admin/events', eventData, true); // Requires authentication
  }

  /**
   * Update an existing event
   * PUT /admin/events/{event_id}
   * Requires organizer role
   */
  static async updateEvent(eventId: string, eventData: UpdateEventRequest): Promise<ApiResponse<Event>> {
    return apiClient.put<Event>(`/admin/events/${eventId}`, eventData, true); // Requires authentication
  }

  /**
   * Delete an event
   * DELETE /admin/events/{event_id}
   * Requires organizer role
   */
  static async deleteEvent(eventId: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/admin/events/${eventId}`, true); // Requires authentication
  }

  /**
   * Register for an event
   * POST /events/{event_id}/register
   * Requires global user email (already registered via auth-service)
   * Prevents duplicate registration per event
   */
  static async registerForEvent(
    eventId: string,
    registration: EventRegistration
  ): Promise<ApiResponse<RegistrationResponse>> {
    return apiClient.post<RegistrationResponse>(
      `/events/${eventId}/register`,
      registration,
      true // Requires authentication
    );
  }

  /**
   * Get all registrations for an event
   * GET /admin/events/{event_id}/registrations
   * Requires organizer role
   */
  static async getEventRegistrations(eventId: string): Promise<ApiResponse<EventRegistration[]>> {
    return apiClient.get<EventRegistration[]>(`/admin/events/${eventId}/registrations`, true); // Requires authentication
  }

  /**
   * Assign role in Events subdomain
   * POST /events/assign-role
   * Scoped to Events subdomain only
   * Requires JWT from global auth-service
   * Allows a user to request or be assigned a role (USER or ORGANIZER)
   */
  static async assignRole(roleRequest: RoleAssignment): Promise<ApiResponse<RoleAssignmentResponse>> {
    return apiClient.post<RoleAssignmentResponse>(
      '/events/assign-role',
      roleRequest,
      true // Requires authentication
    );
  }

  /**
   * Get user role in Events subdomain
   * GET /events/user-role
   * Scoped to Events subdomain only
   * Requires JWT from global auth-service
   */
  static async getUserRole(): Promise<ApiResponse<RoleAssignmentResponse>> {
    return apiClient.get<RoleAssignmentResponse>('/events/user-role', true); // Requires authentication
  }

  /**
   * Get the featured event (assuming it's the first upcoming event)
   */
  static async getFeaturedEvent(): Promise<ApiResponse<Event | null>> {
    const response = await this.getUpcomingEvents();

    if (!response.success || !response.data || response.data.length === 0) {
      return {
        data: null,
        success: true,
      };
    }

    // Get detailed info for the first event
    const firstEvent = response.data[0];
    return this.getEventDetails(firstEvent.id);
  }

  /**
   * Search events by title or location (client-side filtering for now)
   */
  static async searchEvents(query: string): Promise<ApiResponse<EventSummary[]>> {
    const response = await this.getUpcomingEvents();

    if (!response.success || !response.data) {
      return response;
    }

    const filteredEvents = response.data.filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase())
    );

    return {
      data: filteredEvents,
      success: true,
    };
  }

  /**
   * Check if user is already registered for an event (client-side check)
   * This would ideally be a separate API endpoint
   */
  static async checkRegistrationStatus(eventId: string): Promise<boolean> {
    // For now, we'll store registration status in localStorage
    // In a real implementation, this should be an API call
    const registrations = localStorage.getItem('event_registrations');
    if (!registrations) return false;

    try {
      const parsedRegistrations = JSON.parse(registrations) as string[];
      return parsedRegistrations.includes(eventId);
    } catch {
      return false;
    }
  }

  /**
   * Store registration status locally (temporary solution)
   */
  static markAsRegistered(eventId: string): void {
    const registrations = localStorage.getItem('event_registrations');
    let parsedRegistrations: string[] = [];

    if (registrations) {
      try {
        parsedRegistrations = JSON.parse(registrations);
      } catch {
        parsedRegistrations = [];
      }
    }

    if (!parsedRegistrations.includes(eventId)) {
      parsedRegistrations.push(eventId);
      localStorage.setItem('event_registrations', JSON.stringify(parsedRegistrations));
    }
  }
}

export default EventsApiService;