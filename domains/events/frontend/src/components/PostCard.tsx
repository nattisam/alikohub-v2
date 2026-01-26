import { Link } from 'react-router-dom';
import type { Post } from '../types/post';
import { PostType } from '../types/post';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const isEvent = post.type === PostType.EVENT;
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      {post.coverImage && (
        <div className="h-48 overflow-hidden relative">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${
              post.type === PostType.EVENT ? 'bg-blue-600' : 
              post.type === PostType.NEWS ? 'bg-green-600' : 'bg-purple-600'
            }`}>
              {post.type}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-1">
        {!post.coverImage && (
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${
              post.type === PostType.EVENT ? 'bg-blue-600' : 
              post.type === PostType.NEWS ? 'bg-green-600' : 'bg-purple-600'
            }`}>
              {post.type}
            </span>
          </div>
        )}
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.shortDescription}
        </p>
        
        {isEvent && (
          <div className="mt-auto mb-4 bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center text-blue-800 text-sm font-medium mb-1">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {post.eventDate}
            </div>
            {post.location && (
              <div className="flex items-center text-blue-800 text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {post.location}
              </div>
            )}
          </div>
        )}
        
        <div className={`mt-auto flex items-center justify-between ${!isEvent ? 'pt-4 border-t border-gray-50' : ''}`}>
          <span className="text-gray-500 text-xs italic">
            Published: {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}
          </span>
          <Link 
            to={`/post/${post.id}`}
            className="text-blue-600 font-semibold text-sm hover:text-blue-800 flex items-center transition-colors"
          >
            Read More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
