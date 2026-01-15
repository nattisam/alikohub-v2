import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendar, FaTimes, FaUser, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import EventsApiService from '../services/eventsApi';
import UpdatesApiService from '../services/updatesApi';
import { AuthTokenManager, handleApiError } from '../services/apiClient';
import type { Event, Update, EventRegistration } from '../types/api';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState<EventRegistration>({
    email: '',
    name: '',
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
      checkRegistrationStatus();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const eventResponse = await EventsApiService.getEventDetails(id);
      if (!eventResponse.success) {
        throw new Error(eventResponse.error?.error || 'Failed to fetch event details');
      }
      setEvent(eventResponse.data || null);

      const updatesResponse = await UpdatesApiService.getEventUpdates(id);
      if (updatesResponse.success) {
        setUpdates(updatesResponse.data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    if (!id) return;
    const registered = await EventsApiService.checkRegistrationStatus(id);
    setIsRegistered(registered);
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !registrationData.email || !registrationData.name) return;

    try {
      setRegistering(true);
      setError(null);

      const response = await EventsApiService.registerForEvent(id, registrationData);
      if (!response.success) {
        throw new Error(response.error?.error || 'Registration failed');
      }

      EventsApiService.markAsRegistered(id);
      setIsRegistered(true);
      setRegistrationSuccess(true);
      setShowRegistrationForm(false);
      setRegistrationData({ email: '', name: '' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setRegistering(false);
    }
  };

  const formatEventDateTime = (date: string, time: string): string => {
    try {
      const eventDate = new Date(`${date}T${time}`);
      return eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return `${date} at ${time}`;
    }
  };

  const handleBack = () => {
    navigate('/events');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-300">Loading event details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <div className="flex space-x-4">
            <button
              onClick={fetchEventDetails}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Try Again
            </button>
            <button
              onClick={handleBack}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-300 mb-4">Event Not Found</h2>
          <p className="text-gray-400 mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={handleBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 py-4 px-6 flex items-center">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-300 hover:text-white transition"
        >
          <FaArrowLeft className="mr-2" />
          Back to Events
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Event Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-300">
              <FaCalendar className="mr-3 text-blue-400" />
              <span>{formatEventDateTime(event.date, event.time)}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <FaLocationDot className="mr-3 text-blue-400" />
              <span>{event.location}</span>
            </div>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Registration Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Registration</h2>
          
          {registrationSuccess && (
            <div className="bg-green-900 border border-green-500 rounded-lg p-4 mb-4">
              <p className="text-green-300 font-semibold">Registration Successful!</p>
              <p className="text-green-200 text-sm">You have successfully registered for this event.</p>
            </div>
          )}

          {isRegistered && !registrationSuccess ? (
            <div className="bg-blue-900 border border-blue-500 rounded-lg p-4">
              <p className="text-blue-300 font-semibold">Already Registered</p>
              <p className="text-blue-200 text-sm">You are already registered for this event.</p>
            </div>
          ) : !showRegistrationForm ? (
            <div className="text-center">
              {AuthTokenManager.isAuthenticated() ? (
                <button
                  onClick={() => setShowRegistrationForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  Register for Event
                </button>
              ) : (
                <div className="text-gray-400">
                  <p className="mb-2">Please log in to register for this event.</p>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition">
                    Log In
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleRegistration} className="max-w-md mx-auto space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-center">Register for Event</h3>
              
              <div>
                <label className="block text-gray-300 mb-2">
                  <FaUser className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={registering}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded transition"
                >
                  {registering ? 'Registering...' : 'Register'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegistrationForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Updates Section */}
        {updates.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Event Updates</h2>
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.id} className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">{update.title}</h3>
                  <p className="text-gray-300 mb-2">{update.content}</p>
                  <p className="text-gray-500 text-sm">
                    {UpdatesApiService.formatUpdateDate(update.posted_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;