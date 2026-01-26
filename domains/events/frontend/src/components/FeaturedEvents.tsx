import { Link } from 'react-router-dom';
import type { Post } from '../types/post';

interface FeaturedEventsProps {
  events: Post[];
}

export const FeaturedEvents = ({ events }: FeaturedEventsProps) => {
  if (!events || events.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <span className="text-blue-600 font-black uppercase tracking-widest text-sm">Spotlight</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Featured Events</h2>
        </div>
        <Link 
          to="/events" 
          className="text-blue-600 font-bold hover:text-blue-800 flex items-center transition-colors"
        >
          View All
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {events.slice(0, 2).map((event, index) => (
          <div 
            key={event.id}
            className={`group relative overflow-hidden rounded-[2.5rem] shadow-2xl transition-transform duration-500 hover:-translate-y-2 ${
              index === 0 ? 'h-[500px]' : 'h-[500px]'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              {event.coverImage ? (
                <img 
                  src={event.coverImage} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-900"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>

            {/* Content Overflow */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                  {event.type}
                </span>
                <span className="text-white/80 text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {event.eventDate}
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 line-clamp-2 leading-tight">
                {event.title}
              </h3>
              
              <p className="text-gray-300 text-lg mb-8 line-clamp-2 max-w-xl">
                {event.shortDescription}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-white/70 text-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </div>
                <Link 
                  to={`/post/${event.id}`}
                  className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all transform active:scale-95"
                >
                  Join Event
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
