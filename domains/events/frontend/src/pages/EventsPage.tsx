import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UpcomingEvents from '../components/UpcomingEvents';
import FeaturedEvent from '../components/FeaturedEvent';
import EventsApiService from '../services/eventsApi';
import { handleApiError } from '../services/apiClient';
import type { EventSummary } from '../types/api';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await EventsApiService.getUpcomingEvents();
      if (response.success) {
        setEvents(response.data || []);
      } else {
        throw new Error(response.error?.error || 'Failed to fetch events');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    // Navigate to create event page
    navigate('/events/create');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Events</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover and participate in our upcoming events, conferences, and workshops
          </p>
          <button 
            onClick={handleCreateEvent}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Create New Event
          </button>
        </div>
      </div>

      {/* Featured Event */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Event</h2>
        <FeaturedEvent />
      </div>

      {/* All Events */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">All Events</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search events..."
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>All Categories</option>
              <option>Conference</option>
              <option>Workshop</option>
              <option>Webinar</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={fetchEvents}
              className="mt-2 text-red-800 hover:text-red-900 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <UpcomingEvents events={events} />
        )}
      </div>
    </div>
  );
};

export default EventsPage;