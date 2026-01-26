import { useQuery } from '@tanstack/react-query';
import { PostList } from '../components/PostList';
import { getAllPublishedPosts } from '../services/post-service';
import { PostType } from '../types/post';

export default function NewsPage() {
  const { data: posts = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['published-posts', 'news-and-announcements'],
    queryFn: async () => {
      const allPosts = await getAllPublishedPosts();
      return allPosts.filter(p => 
        p.type === PostType.NEWS || 
        p.type === PostType.ANNOUNCEMENT
      );
    }
  });

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            News & <span className="text-blue-600">Announcements</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl">
            Stay updated with the latest news, success stories, and important announcements from the AlikoHub ecosystem.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <PostList 
          posts={posts} 
          isLoading={isLoading} 
          isError={isError}
          error={error}
          onRetry={refetch}
          emptyMessage="No news or announcements found."
        />
      </div>
    </div>
  );
}
