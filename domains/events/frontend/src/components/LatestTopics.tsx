import { useState, useEffect } from 'react';
import latestTopic from "../assets/latestEvent.png";
import UpdatesApiService from '../services/updatesApi';
import type { Update } from '../types/api';

interface LatestTopicsProps {
  updates?: Update[];
  limit?: number;
}

const LatestTopics: React.FC<LatestTopicsProps> = ({ updates: propUpdates, limit = 5 }) => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestUpdates = async () => {
      try {
        setLoading(true);
        setError(null);

        if (propUpdates) {
          setUpdates(propUpdates.slice(0, limit));
        } else {
          const response = await UpdatesApiService.getLatestUpdates(limit);
          if (!response.success) {
            throw new Error(response.error?.error || 'Failed to fetch updates');
          }
          setUpdates(response.data || []);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching updates';
        setError(errorMessage);
        console.error('Error fetching latest updates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestUpdates();
  }, [propUpdates, limit]);

  const handleTopicClick = (updateId: string) => {
    // You could implement navigation to a detailed view of the update
    console.log('Update clicked:', updateId);
  };

  if (loading) {
    return (
      <section className="relative w-[90%] not-md:mx-auto md:left-10 rounded-xl border-1 border-white p-2 md:py-8 md:px-8 md:w-2/5">
        <h2 className="text-2xl mb-4">Latest Updates</h2>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          <span className="ml-3 text-gray-300 text-sm">Loading updates...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-[90%] not-md:mx-auto md:left-10 rounded-xl border-1 border-white p-2 md:py-8 md:px-8 md:w-2/5">
        <h2 className="text-2xl mb-4">Latest Updates</h2>
        <div className="text-center text-red-400 py-8">
          <p className="text-sm">Error loading updates: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-blue-400 hover:text-blue-300 underline text-sm"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (updates.length === 0) {
    return (
      <section className="relative w-[90%] not-md:mx-auto md:left-10 rounded-xl border-1 border-white p-2 md:py-8 md:px-8 md:w-2/5">
        <h2 className="text-2xl mb-4">Latest Updates</h2>
        <div className="text-center text-gray-400 py-8">
          <p className="text-sm">No updates available at the moment.</p>
          <p className="text-xs mt-2">Check back later for the latest news!</p>
        </div>
      </section>
    );
  }
  return (
    <section className="relative w-[90%] not-md:mx-auto md:left-10 rounded-xl border-1 border-white p-2 md:py-8 md:px-8 md:w-2/5">
      <h2 className="text-2xl mb-4">Latest Updates</h2>
      <div className="flex flex-col items-center gap-4 md:h-[20rem] md:min-w-fit overflow-x-hidden overflow-y-scroll">
        {updates.map((update) => (
          <div
            key={update.id}
            className="p-1 rounded hover:scale-105 grid grid-cols-3 gap-2 h-min transition cursor-pointer"
            onClick={() => handleTopicClick(update.id)}
          >
            <img src={latestTopic} alt={update.title} className="w-full col-span-1 h-16 object-cover rounded" />
            <div className="col-span-2">
              <h3 className="font-bold text-sm">{update.title}</h3>
              <p className="text-xs text-gray-400">News Update</p>
              <p className="text-xs text-gray-300 mt-1">
                {UpdatesApiService.truncateContent(update.content, 80)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {UpdatesApiService.formatUpdateDate(update.posted_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestTopics;