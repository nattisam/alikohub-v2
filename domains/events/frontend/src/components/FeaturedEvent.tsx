import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendar } from "react-icons/fa";
import boyWithVRGlass from "../assets/young-woman-man-with-vr-glasses.png";
import { FaLocationDot } from "react-icons/fa6";
import EventsApiService from '../services/eventsApi';
import { handleApiError } from '../services/apiClient';
import type { Event } from '../types/api';

interface FeaturedEventProps {
  featuredEvent?: Event;
}

const FeaturedEvent: React.FC<FeaturedEventProps> = ({ featuredEvent: propEvent }) => {
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        if (propEvent) {
          setFeaturedEvent(propEvent);
        } else {
          const response = await EventsApiService.getFeaturedEvent();
          if (!response.success) {
            throw new Error(response.error?.error || 'Failed to fetch featured event');
          }
          setFeaturedEvent(response.data || null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('Error fetching featured event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvent();
  }, [propEvent]);

  const calculateDaysRemaining = (date: string, time: string): number => {
    try {
      const eventDate = new Date(`${date}T${time}`);
      const now = new Date();
      const diffInMs = eventDate.getTime() - now.getTime();
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      return Math.max(0, diffInDays);
    } catch {
      return 0;
    }
  };

  const formatEventDate = (date: string, time: string): string => {
    try {
      const eventDate = new Date(`${date}T${time}`);
      return eventDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return `${date} at ${time}`;
    }
  };

  const handleRegisterClick = () => {
    if (featuredEvent) {
      // Use react-router navigation instead of window.location
      navigate(`/events/${featuredEvent.id}`);
    }
  };

  if (loading) {
    return (
      <section className="relative not-md:-top-16 ml-4 md:absolute md:right-10 w-[95%] md:w-1/2">
        <div className="relative md:-top-[45vh] -top-[25vh] py-8 md:px-8 px-4 bg-center bg-cover bg-gray-800 rounded-lg">
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-gray-300">Loading featured event...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || !featuredEvent) {
    return (
      <section className="relative not-md:-top-16 ml-4 md:absolute md:right-10 w-[95%] md:w-1/2">
        <div className="relative md:-top-[45vh] -top-[25vh] py-8 md:px-8 px-4 bg-center bg-cover bg-gray-800 rounded-lg">
          <div className="text-center text-gray-400 py-8">
            <h2 className="text-3xl font-bold mb-4">Featured Event</h2>
            <p>{error || 'No featured event available at the moment.'}</p>
            <p className="text-sm mt-2">Check back later for exciting events!</p>
          </div>
        </div>
      </section>
    );
  }

  const daysRemaining = calculateDaysRemaining(featuredEvent.date, featuredEvent.time);
  const formattedDate = formatEventDate(featuredEvent.date, featuredEvent.time);
  return (
    <section className="relative not-md:-top-16 ml-4 md:absolute md:right-10 w-[95%] md:w-1/2">
      <div
        className="relative md:-top-[45vh] -top-[25vh] py-8 md:px-8 px-4 bg-center bg-cover "
        style={{ backgroundImage: `url(${boyWithVRGlass})` }}
      >
        <h2 className="text-3xl font-bold">Featured Event</h2>
        <h3 className="text-5xl font-extrabold">{featuredEvent.title}</h3>
        <div className="text-sm">
          <span className="flex gap-2 my-2">
            <FaCalendar size={20} color="white" /> {formattedDate}
          </span>
          <span className="flex gap-2 my-2">
            <FaLocationDot size={20} color="white" /> {featuredEvent.location}
          </span>
        </div>
        <p>{featuredEvent.description}</p>
        <div className="flex flex-row justify-between items-center md:pr-15">
          <button 
            onClick={handleRegisterClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition mt-4"
          >
            Register Now
          </button>
          <p className="mt-2 text-white text-sm md:text-lg">
            <span className="text-xl md:text-3xl font-bold">{daysRemaining}</span> Days Remaining
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvent;