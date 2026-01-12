import React, { useState, useEffect } from 'react';
import { FaPlus, FaUsers, FaCalendar, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { useIsOrganizer } from '../contexts/AuthContext';
import EventsApiService from '../services/eventsApi';
import { handleApiError } from '../services/apiClient';
import type { Event, EventSummary, EventRegistration } from '../types/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const isOrganizer = useIsOrganizer();
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'create' | 'edit' | 'attendees'>('events');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: ''
  });
  const [attendees, setAttendees] = useState<EventRegistration[]>([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  useEffect(() => {
    if (isOpen && isOrganizer) {
      fetchEvents();
    }
  }, [isOpen, isOrganizer]);

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
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetails = async (eventId: string) => {
    try {
      const response = await EventsApiService.getEventDetails(eventId);
      if (response.success) {
        setSelectedEvent(response.data || null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch event details';
      setError(errorMessage);
    }
  };

  const fetchEventAttendees = async (eventId: string) => {
    try {
      setAttendeesLoading(true);
      const response = await EventsApiService.getEventRegistrations(eventId);
      if (response.success) {
        setAttendees(response.data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch attendees';
      setError(errorMessage);
    } finally {
      setAttendeesLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await EventsApiService.createEvent(eventForm);
      if (response.success) {
        setActiveTab('events');
        setEventForm({
          title: '',
          description: '',
          date: '',
          time: '',
          location: ''
        });
        fetchEvents(); // Refresh events list
      } else {
        throw new Error(response.error?.error || 'Failed to create event');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      setError(errorMessage);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    
    try {
      const updateData = {
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location
      };
      
      const response = await EventsApiService.updateEvent(selectedEvent.id, updateData);
      if (response.success) {
        setActiveTab('events');
        setSelectedEvent(null);
        setEventForm({
          title: '',
          description: '',
          date: '',
          time: '',
          location: ''
        });
        fetchEvents(); // Refresh events list
      } else {
        throw new Error(response.error?.error || 'Failed to update event');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      setError(errorMessage);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await EventsApiService.deleteEvent(eventId);
      if (response.success) {
        fetchEvents(); // Refresh events list
      } else {
        throw new Error(response.error?.error || 'Failed to delete event');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      setError(errorMessage);
    }
  };

  const handleEditEvent = (event: EventSummary) => {
    // Fetch full event details
    fetchEventDetails(event.id);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location
    });
    setActiveTab('edit');
  };

  const handleViewAttendees = (event: EventSummary) => {
    setSelectedEvent({ ...event, id: event.id } as Event);
    fetchEventAttendees(event.id);
    setActiveTab('attendees');
  };

  const formatDate = (date: string, time: string) => {
    try {
      const eventDate = new Date(`${date}T${time}`);
      return eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return `${date} at ${time}`;
    }
  };

  if (!isOpen) return null;

  if (!isOrganizer) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg p-8 max-w-md text-center">
          <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">You need organizer privileges to access the admin dashboard.</p>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Organizer Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <nav className="flex">
            <button
              className={`px-4 py-3 font-medium text-sm ${activeTab === 'events' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('events')}
            >
              <FaCalendar className="inline mr-2" />
              Manage Events
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${activeTab === 'create' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => {
                setActiveTab('create');
                setSelectedEvent(null);
                setEventForm({
                  title: '',
                  description: '',
                  date: '',
                  time: '',
                  location: ''
                });
              }}
            >
              <FaPlus className="inline mr-2" />
              Create Event
            </button>
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-900 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-300">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-red-200 hover:text-white text-sm underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Events List Tab */}
          {activeTab === 'events' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Your Events</h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-300">Loading events...</span>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">You haven't created any events yet.</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  >
                    Create Your First Event
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <div key={event.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-bold text-white mb-2">{event.title}</h4>
                      <p className="text-gray-400 text-sm mb-2">{formatDate(event.date, event.time)}</p>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm transition flex items-center justify-center"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleViewAttendees(event)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-sm transition"
                        >
                          <FaUsers className="mr-1" /> Attendees
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-sm transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create Event Tab */}
          {activeTab === 'create' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Create New Event</h3>
              <form onSubmit={handleCreateEvent} className="max-w-2xl">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Event Title</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Date</label>
                      <input
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Time</label>
                      <input
                        type="time"
                        value={eventForm.time}
                        onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                    >
                      Create Event
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('events')}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Edit Event Tab */}
          {activeTab === 'edit' && selectedEvent && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Edit Event</h3>
              <form onSubmit={handleUpdateEvent} className="max-w-2xl">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Event Title</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Date</label>
                      <input
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Time</label>
                      <input
                        type="time"
                        value={eventForm.time}
                        onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                    >
                      Update Event
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('events')}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Attendees Tab */}
          {activeTab === 'attendees' && selectedEvent && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Attendees for "{selectedEvent.title}"</h3>
                <button
                  onClick={() => setActiveTab('events')}
                  className="text-gray-400 hover:text-white"
                >
                  Back to Events
                </button>
              </div>
              
              {attendeesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-300">Loading attendees...</span>
                </div>
              ) : attendees.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No attendees registered for this event yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="py-3 px-4 text-left text-gray-300 font-semibold">Name</th>
                        <th className="py-3 px-4 text-left text-gray-300 font-semibold">Email</th>
                        <th className="py-3 px-4 text-left text-gray-300 font-semibold">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.map((attendee, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                          <td className="py-3 px-4 text-white">{attendee.name}</td>
                          <td className="py-3 px-4 text-gray-300">{attendee.email}</td>
                          <td className="py-3 px-4 text-gray-300">-</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;