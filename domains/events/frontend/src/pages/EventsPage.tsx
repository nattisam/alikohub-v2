import { useQuery } from '@tanstack/react-query';
import { PostList } from '../components/PostList';
import { getPublishedPostsByType } from '../services/post-service';
import { PostType } from '../types/post';

export default function EventsPage() {
  const { data: posts = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['published-posts', PostType.EVENT],
    queryFn: () => getPublishedPostsByType(PostType.EVENT),
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6">
            Explore <span className="text-blue-600">Events</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Discover community gatherings, workshops, and ecosystem events. Stay engaged with the AlikoHub community.
          </p>
        </div>
      </div>

      {/* Events Feed Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4 uppercase tracking-widest text-sm">Upcoming & Past</h2>
          <div className="hidden md:flex gap-4">
             {/* Simple filter buttons if needed later */}
             <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Chronological Order</span>
          </div>
        </div>

        <PostList 
          posts={posts} 
          isLoading={isLoading} 
          isError={isError}
          error={error}
          onRetry={refetch}
          emptyMessage="No events found at the moment. Please check back soon!"
        />
      </div>
    </div>
  );
}