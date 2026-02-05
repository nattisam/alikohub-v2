import { Calendar, User } from 'lucide-react';
import type { Event } from './data/events';

export default function EventCard({ event }: { event: Event }) {
  const badgeColors = {
    UPCOMING: 'bg-blue-00 text-blue-600',
    ONGOING: 'bg-green-100 text-green-600',
    PAST: 'bg-gray-200 text-gray-600',
  };

  return (
    <div className="bg-black rounded-xl shadow-sm border overflow-hidden">
      <div className="relative">
        <img src={event.image} className="h-40 w-full object-cover" />
        <span
          className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full font-medium ${badgeColors[event.status]}`}
        >
          {event.status}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-white-600 leading-snug">
          {event.title}
        </h3>

        <p className="text-sm text-white-600 line-clamp-2">
          {event.description}
        </p>

        <div className="text-xs text-white-500 flex flex-col gap-2">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {event.date}
          </span>
          <span className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Manager: {event.manager}
          </span>
        </div>
      </div>
    </div>
  );
}
