import { useState, useEffect } from 'react';
import { FaCalendar, FaTimes, FaUser, FaEnvelope } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import EventsApiService from '../services/eventsApi';
import UpdatesApiService from '../services/updatesApi';
import { AuthTokenManager, handleApiError } from '../services/apiClient';
import type { Event, Update, EventRegistration } from '../types/api';

// This component is now deprecated since we're using dedicated pages for event details
// Keeping it for potential future use or reference

interface EventDetailModalProps {
  eventId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = (_props) => {
  // Component is deprecated - return null
  return null;
};

export default EventDetailModal;