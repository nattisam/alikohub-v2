import { Plus } from 'lucide-react';

import SearchBar from '../components/SearchBar';
import ViewToggle from '../components/ViewToggle';
import { PostList } from '../components/PostList';
import type { Post } from '../types/post';

// Mock data with images
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'AlikoHub Tech Meetup',
    type: 'event',
    content: 'Join us for our monthly tech meetup where we discuss the latest in AI and blockchain.',
    createdAt: '2026-01-29',
    author: {
      name: 'Eyu',
      avatar: '/images/avater1.jpg',
    },
    image: 'https://i.pinimg.com/736x/e5/ca/00/e5ca00308bacd2ec74b0b12bb60755d0.jpg',
  },
  {
    id: '2',
    title: 'Startup Pitch Night',
    type: 'event',
    content: 'Pitch your startup idea and get feedback from experienced investors.',
    createdAt: '2026-02-05',
    author: {
      name: 'Alice',
      avatar: '/images/avater2.jpg',
    },
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'React Workshop',
    type: 'event',
    content: 'Hands-on workshop for React beginners and enthusiasts.',
    createdAt: '2026-02-10',
    author: {
      name: 'Bob',
      avatar: '/images/avater3.jpg',
    },
    image: 'https://i.pinimg.com/1200x/df/b8/9a/dfb89a8f304d3fb95c9b4327e22ca19f.jpg',
  },
  
  {
    id: '4',
    title: 'AlikoHub Tech Meetup',
    type: 'event',
    content: 'Join us for our monthly tech meetup where we discuss the latest in AI and blockchain.',
    createdAt: '2026-01-29',
    author: {
      name: 'Eyu',
      avatar: '/images/avater1.jpg',
    },
    image: 'https://i.pinimg.com/736x/e5/ca/00/e5ca00308bacd2ec74b0b12bb60755d0.jpg',
  },

  {
    id: '5',
    title: 'React Workshop',
    type: 'event',
    content: 'Hands-on workshop for React beginners and enthusiasts.',
    createdAt: '2026-02-10',
    author: {
      name: 'Bob',
      avatar: '/images/avater3.jpg',
    },
    image: 'https://i.pinimg.com/1200x/df/b8/9a/dfb89a8f304d3fb95c9b4327e22ca19f.jpg',
  },

  
  {
    id: '6',
    title: 'Startup Pitch Night',
    type: 'event',
    content: 'Pitch your startup idea and get feedback from experienced investors.',
    createdAt: '2026-02-05',
    author: {
      name: 'Alice',
      avatar: '/images/avater2.jpg',
    },
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '7',
    title: 'AlikoHub Tech Meetup',
    type: 'event',
    content: 'Join us for our monthly tech meetup where we discuss the latest in AI and blockchain.',
    createdAt: '2026-01-29',
    author: {
      name: 'Eyu',
      avatar: '/images/avater1.jpg',
    },
    image: 'https://i.pinimg.com/736x/e5/ca/00/e5ca00308bacd2ec74b0b12bb60755d0.jpg',
  },
  {
    id: '8',
    title: 'React Workshop',
    type: 'event',
    content: 'Hands-on workshop for React beginners and enthusiasts.',
    createdAt: '2026-02-10',
    author: {
      name: 'Bob',
      avatar: '/images/avater3.jpg',
    },
    image: 'https://i.pinimg.com/1200x/df/b8/9a/dfb89a8f304d3fb95c9b4327e22ca19f.jpg',
  },
  {
    id: '9',
    title: 'Startup Pitch Night',
    type: 'event',
    content: 'Pitch your startup idea and get feedback from experienced investors.',
    createdAt: '2026-02-05',
    author: {
      name: 'Alice',
      avatar: '/images/avater2.jpg',
    },
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
  // Add the remaining mockPosts here as needed
];

export default function EventsPage() {
  const isLoading = false;
  const isError = false;

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/935732546/photo/background-of-glowing-abstract-lines-and-spheres.jpg?s=1024x1024&w=is&k=20&c=9IRPAamDgvs-0oR1Y7SP3XQhw6qI0kqKivbGrV8Lz9Y=')",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      {/* Page Content */}
      <div className="relative z-10">
        {/* Page Header */}
        <div className="bg-gray-800/70 border-b">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-white">Events</h1>
                <p className="text-sm text-gray-200 mt-1">
                  Manage and discover all AlikoHub platform events in one place.
                </p>
              </div>
            </div>

            {/* Search + View Controls */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mt-8">
              <SearchBar />
              <ViewToggle />
            </div>
          </div>
        </div>

        {/* Events List */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <PostList
            posts={mockPosts}
            isLoading={isLoading}
            isError={isError}
            emptyMessage="No events found at the moment. Please check back soon!"
          />
        </main>
      </div>
    </div>
  );
}
