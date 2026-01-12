import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mainThumb from "../assets/events_thumbnail.png";
import subThumb from "../assets/latestEvent.png";
import EventsApiService from '../services/eventsApi';
import UpdatesApiService from '../services/updatesApi';
import { handleApiError } from '../services/apiClient';
import type { EventSummary, Update } from '../types/api';

interface UpcomingEventsProps {
  events?: EventSummary[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events: propEvents }) => {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [eventUpdates, setEventUpdates] = useState<Record<string, Update[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventsAndUpdates = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use prop events if provided, otherwise fetch from API
        let eventsData: EventSummary[];
        if (propEvents) {
          eventsData = propEvents;
        } else {
          const eventsResponse = await EventsApiService.getUpcomingEvents();
          if (!eventsResponse.success) {
            throw new Error(eventsResponse.error?.error || 'Failed to fetch events');
          }
          eventsData = eventsResponse.data || [];
        }

        setEvents(eventsData);

        // Fetch updates for each event
        const updatesPromises = eventsData.map(async (event) => {
          const updatesResponse = await UpdatesApiService.getEventUpdates(event.id);
          return {
            eventId: event.id,
            updates: updatesResponse.success ? (updatesResponse.data || []).slice(0, 2) : [], // Limit to 2 updates per event
          };
        });

        const updatesResults = await Promise.all(updatesPromises);
        const updatesMap: Record<string, Update[]> = {};
        updatesResults.forEach(({ eventId, updates }) => {
          updatesMap[eventId] = updates;
        });
        
        setEventUpdates(updatesMap);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching events';
        setError(errorMessage);
        console.error('Error fetching events and updates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndUpdates();
  }, [propEvents]);

  const handleEventClick = (eventId: string) => {
    console.log("Event clicked:", eventId);
    // Navigate to the event detail page instead of opening a modal
    navigate(`/events/${eventId}`);
  };

  const formatEventDate = (date: string, time: string) => {
    try {
      const eventDate = new Date(`${date}T${time}`);
      return eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return `${date} at ${time}`;
    }
  };

  if (loading) {
    return (
      <section className="relative md:left-[50%] md:-top-[20rem] md:h-[20rem] bg-black w-full md:w-1/2 py-8 px-4 md:px-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-gray-300">Loading events...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative md:left-[50%] md:-top-[20rem] md:h-[20rem] bg-black w-full md:w-1/2 py-8 px-4 md:px-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <div className="text-center text-red-400 py-8">
          <p>Error loading events: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-blue-400 hover:text-blue-300 underline"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="relative md:left-[50%] md:-top-[20rem] md:h-[20rem] bg-black w-full md:w-1/2 py-8 px-4 md:px-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <div className="text-center text-gray-400 py-8">
          <p>No upcoming events at the moment.</p>
          <p className="text-sm mt-2">Check back later for new events!</p>
        </div>
      </section>
    );
  }
  return (
    <section className="relative md:left-[50%] md:-top-[20rem] md:h-[20rem] bg-black w-full md:w-1/2 py-8 px-4 md:px-8">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <div id="upcoming-events" className="flex flex-col gap-6 overflow-y-scroll h-[90vh] p-4">
        {events.map((event) => {
          const eventUpdatesForThis = eventUpdates[event.id] || [];
          
          return (
            <div
              key={event.id}
              className="min-h-fit grid grid-cols-1 md:grid-cols-5 gap-2 overflow-hidden hover:shadow-lg transition cursor-pointer border border-gray-700 rounded-lg p-4"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="col-span-2 min-h-fit">
                <img
                  src={mainThumb} // Default thumbnail for now
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-300 mb-2">
                    {formatEventDate(event.date, event.time)}
                  </p>
                  <p className="text-sm text-gray-400">
                    📍 {event.location}
                  </p>
                  <p className="text-sm mt-2">
                    {event.description.length > 100 
                      ? event.description.substring(0, 100) + '...' 
                      : event.description
                    }
                  </p>
                </div>
              </div>
              <div className="col-span-3 grid grid-cols-1 grid-rows-2 gap-2">
                {eventUpdatesForThis.length > 0 ? (
                  eventUpdatesForThis.map((update, index) => (
                    <div className="h-fit flex flex-row items-start gap-2" key={update.id}>
                      <img src={subThumb} alt="Update" className="w-[5rem] h-12 object-cover rounded" />
                      <div className="flex flex-col">
                        <h3 className="text-sm font-semibold">{update.title}</h3>
                        <p className="text-xs text-gray-400">
                          {UpdatesApiService.formatUpdateDate(update.posted_at)}
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          {UpdatesApiService.truncateContent(update.content, 120)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 flex items-center justify-center text-gray-500 text-sm">
                    <p>No recent updates for this event</p>
                  </div>
                )}
                
                {/* Fill remaining slots if less than 2 updates */}
                {eventUpdatesForThis.length === 1 && (
                  <div className="h-fit flex items-center justify-center text-gray-500 text-xs">
                    <p>More updates coming soon...</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UpcomingEvents;