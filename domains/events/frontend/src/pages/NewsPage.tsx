import { useQuery } from '@tanstack/react-query';
import { getAllPublishedPosts } from '../services/post-service';
import { PostType } from '../types/post';
import { ArrowRight } from 'lucide-react';

export default function NewsPage() {
  const { data: postsData = [] } = useQuery({
    queryKey: ['published-posts', 'news-and-announcements'],
    queryFn: async () => {
      const allPosts = await getAllPublishedPosts();
      return allPosts.filter(
        p => p.type === PostType.NEWS || p.type === PostType.ANNOUNCEMENT
      );
    },
    enabled: false,
  });

  const posts = [
    {
      id: '1',
      title: 'Enterprise API V2 Integration Now Live',
      content:
        'We are excited to announce our latest integration capabilities for enterprise partners, featuring enhanced security protocols and faster data streaming.',
      type: 'NEWS',
      secondary: 'UPDATE',
      author: 'Sarah Jenkins',
      time: '2 hours ago',
      image:
        'https://i.pinimg.com/736x/5f/c9/f1/5fc9f13c0ffd4e367f5cbea6cac38de3.jpg',
    },
    {
      id: '2',
      title: 'Annual Global Tech Summit 2024 Keynote',
      content:
        "AlikoHub's CEO will be presenting our 5-year vision for decentralized infrastructure at the upcoming Global Tech Summit.",
      type: 'NEWS',
      author: 'Marcus Chen',
      time: 'Yesterday',
      image:
        'https://i.pinimg.com/736x/81/6a/9f/816a9fefb27a7969f31f95dc6b71e959.jpg',
    },
    {
      id: '3',
      title: 'Q2 Performance & Security Audit Results',
      content:
        'Detailed breakdown of our security performance metrics following the recent infrastructure hardening phase.',
      type: 'UPDATED',
      secondary: 'INSIGHTS',
      author: 'Elena Rodriguez',
      time: 'May 12',
      image:
        'https://i.pinimg.com/736x/81/6a/9f/816a9fefb27a7969f31f95dc6b71e959.jpg',
    },
    {
      id: '4',
      title: 'New Partnership: AlikoHub & CloudMatrix',
      content:
        'Expanding our cloud footprint with strategic data center alliances in EMEA regions.',
      type: 'ANNOUNCEMENT',
      author: 'Sarah Jenkins',
      time: 'May 10',
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const typeColors: Record<string, string> = {
    NEWS: 'bg-blue-600 text-white',
    ANNOUNCEMENT: 'bg-purple-600 text-white',
    UPDATED: 'bg-green-600 text-white',
    INSIGHTS: 'bg-yellow-600 text-black',
  };

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat min-h-screen text-white"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/935732546/photo/background-of-glowing-abstract-lines-and-spheres.jpg?s=1024x1024&w=is&k=20&c=9IRPAamDgvs-0oR1Y7SP3XQhw6qI0kqKivbGrV8Lz9Y=')",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      {/* Header */}
      <div className="relative container mx-auto text-center px-4 py-16 z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          News & <span className="text-blue-400">Announcements</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Stay updated with the latest news, success stories, and important announcements from the AlikoHub ecosystem.
        </p>
      </div>

      {/* News Feed */}
      <div className="relative container mx-auto px-4 py-4 z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className={`flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-gray-800/70 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              {post.image && (
                <div className="w-full md:w-1/3 h-48 md:h-48 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-md ${
                        typeColors[post.type] ?? 'bg-gray-600 text-white'
                      }`}
                    >
                      {post.type}
                    </span>
                    {post.secondary && (
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-md ${
                          typeColors[post.secondary] ?? 'bg-gray-700 text-gray-200'
                        }`}
                      >
                        {post.secondary}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{post.time}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                  {post.title}
                </h2>

                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <div className="w-6 h-6 rounded-full bg-gray-600" />
                  <span>By {post.author}</span>
                </div>

                <p className="text-gray-300 mb-4">{post.content}</p>

                <button className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Read more
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
