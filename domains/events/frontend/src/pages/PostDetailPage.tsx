import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPublishedPostById } from '../services/post-service';
import { PostType } from '../types/post';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPublishedPostById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 animate-pulse">
        <div className="h-96 bg-gray-100 rounded-3xl mb-8"></div>
        <div className="max-w-3xl mx-auto">
          <div className="h-12 bg-gray-100 rounded-xl mb-4 w-3/4"></div>
          <div className="h-6 bg-gray-100 rounded-lg mb-8 w-1/4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h2>
        <p className="text-gray-600 mb-8">The content you are looking for might have been removed or is temporarily unavailable.</p>
        <Link to="/" className="text-blue-600 font-bold hover:underline">Return to Home</Link>
      </div>
    );
  }

  const isEvent = post.type === PostType.EVENT;

  return (
    <article className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[60vh] bg-gray-900 overflow-hidden">
        {post.coverImage ? (
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900 opacity-60"></div>
        )}
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider text-white mb-6 ${
                post.type === PostType.EVENT ? 'bg-blue-600' : 
                post.type === PostType.NEWS ? 'bg-green-600' : 'bg-purple-600'
              }`}>
                {post.type}
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                {post.title}
              </h1>
              <div className="mt-6 flex items-center text-gray-300 space-x-6 text-sm md:text-base">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}
                </span>
                {post.createdByName && (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    By {post.createdByName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Internal Navigation / Breadcrumbs */}
          <div className="py-6 border-b border-gray-100 mb-10 flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <Link to={isEvent ? "/events" : "/news"} className="hover:text-blue-600 transition">
              {isEvent ? "Events" : "News & Announcements"}
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-12">
            {/* Content */}
            <div className="flex-1">
              {/* Excerpt/Short Description */}
              <div className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed mb-12 italic border-l-4 border-blue-500 pl-6">
                {post.shortDescription}
              </div>

              {/* Main Rich Text Content */}
              <div className="prose prose-lg max-w-none text-gray-800 leading-loose">
                {post.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Sidebar for Event Details */}
            {isEvent && (
              <div className="md:w-80 shrink-0">
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 sticky top-24 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Event Details</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-600 p-2.5 rounded-lg mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Date</p>
                        <p className="text-gray-900 font-semibold">{post.eventDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-600 p-2.5 rounded-lg mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Time</p>
                        <p className="text-gray-900 font-semibold">{post.eventTime}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-600 p-2.5 rounded-lg mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Location</p>
                        <p className="text-gray-900 font-semibold">{post.location}</p>
                      </div>
                    </div>

                    {post.externalLink && (
                      <div className="pt-4">
                        <a 
                          href={post.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                        >
                          Join Event
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
