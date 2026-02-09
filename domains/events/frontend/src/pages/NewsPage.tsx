import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllPublishedPosts } from '../services/post-service';
import { PostType } from '../types/post';
import { ArrowRight } from 'lucide-react';

export default function NewsPage() {
  const [openPostId, setOpenPostId] = useState<string | null>(null);

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
      fullContent:
        'This update introduces OAuth 2.1 compliance, real-time streaming endpoints, advanced rate limiting, and improved developer documentation. Enterprise clients can now onboard faster with increased reliability and performance.',
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
      fullContent:
        'The keynote will focus on decentralized cloud architecture, AI-powered infrastructure optimization, and sustainable scaling strategies across emerging markets.',
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
      fullContent:
        'Our Q2 audit confirms 99.99% uptime, zero critical vulnerabilities, and significant improvements in threat detection and response times across all services.',
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
      fullContent:
        'This partnership enables low-latency cloud services across Europe, the Middle East, and Africa, supporting enterprise-scale deployments and regulatory compliance.',
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

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
              className={`flex flex-col md:flex-row gap-6 p-6 bg-gray-800/70 rounded-xl shadow-lg transition-shadow ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              {post.image && (
                <div className="w-full md:w-1/3 h-48 rounded-xl overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between mb-2 flex-wrap gap-2">
                  <div className="flex gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-md ${
                        typeColors[post.type] ?? 'bg-gray-600'
                      }`}
                    >
                      {post.type}
                    </span>
                    {post.secondary && (
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-md ${
                          typeColors[post.secondary] ?? 'bg-gray-700'
                        }`}
                      >
                        {post.secondary}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{post.time}</span>
                </div>

                <h2 className="text-2xl font-semibold mb-3">{post.title}</h2>

                <p className="text-gray-300 mb-4">{post.content}</p>

                {/* Expanded content */}
                {openPostId === post.id && (
                  <div className="mb-4 p-4 bg-gray-900/70 border border-gray-700 rounded-lg text-sm text-gray-300">
                    {post.fullContent}
                  </div>
                )}

                <button
                  onClick={() =>
                    setOpenPostId(openPostId === post.id ? null : post.id)
                  }
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
                >
                  {openPostId === post.id ? 'Read less' : 'Read more'}
                  <ArrowRight
                    size={16}
                    className={`transition-transform ${
                      openPostId === post.id ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
