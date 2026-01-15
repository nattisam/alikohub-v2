// TypeScript interfaces for API data types based on AlikoEvent API Documentation

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizerId?: string;
}

export interface EventSummary {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface EventRegistration {
  email: string;
  name: string;
}

export interface RegistrationResponse {
  message: string;
  registration_id: string;
}

export interface Update {
  id: string;
  title: string;
  content: string;
  posted_at: string;
  eventId?: string;
}

export interface Attendee {
  name: string;
  email: string;
  registration_id?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}

export interface UpdateEventRequest extends CreateEventRequest { }

export interface CreateUpdateRequest {
  title: string;
  content: string;
  eventId?: string;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}