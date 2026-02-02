import { ArrowRight } from 'lucide-react';

/**
 * TEMPORARY UI-ONLY COMPONENT
 * Uses dummy data to design the News & Announcements feed.
 * Replace dummyPost with real `post` prop later.
 */

export function PostCard() {
  const dummyPost = {
    title: 'Enterprise API V2 Integration Now Live',
    content:
      'We are excited to announce our latest integration capabilities for enterprise partners, featuring enhanced security protocols and faster data streaming.',
    type: 'NEW',
    secondaryType: 'UPDATE',
    author: 'Sarah Jenkins',
    time: '2 hours ago',
    hasImage: false,
  };

  return (
    <article className="py-8 border-b border-gray-200">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <span className="text-xs font-semibold px-2 py-1 rounded-md bg-blue-100 text-blue-700">
            {dummyPost.type}
          </span>
          <span className="text-xs font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-700">
            {dummyPost.secondaryType}
          </span>
        </div>

        <span className="text-xs text-gray-400">{dummyPost.time}</span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {dummyPost.title}
      </h2>

      {/* Author */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <div className="w-6 h-6 rounded-full bg-gray-300" />
        <span>By {dummyPost.author}</span>
      </div>

      {/* Optional image placeholder */}
      {dummyPost.hasImage && (
        <div className="mb-4 h-40 rounded-xl bg-blue-100 flex items-center justify-center">
          <div className="w-10 h-10 rounded-md bg-blue-200">📊</div>
        </div>
      )}

      {/* Content */}
      <p className="text-sm text-gray-600 mb-4 max-w-2xl">
        {dummyPost.content}
      </p>

      {/* Action */}
      <button className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
        Read more
        <ArrowRight size={14} />
      </button>
    </article>
  );
}
