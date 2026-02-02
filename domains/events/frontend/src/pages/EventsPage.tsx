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
      avatar: '/images/avater3.jpg',
    },
    image: 'https://i.pinimg.com/736x/e5/ca/00/e5ca00308bacd2ec74b0b12bb60755d0.jpg',
  },
  {
    id: '5',
    title: 'Startup Pitch Night',
    type: 'event',
    content: 'Pitch your startup idea and get feedback from experienced investors.',
    createdAt: '2026-02-05',
    author: {
      name: 'Alice',
      avatar: '/images/avater3.jpg',
    },
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
    {
    id: '6',
    title: 'Startup Pitch Night',
    type: 'event',
    content: 'Pitch your startup idea and get feedback from experienced investors.',
    createdAt: '2026-02-05',
    author: {
      name: 'Alice',
      avatar: '/images/avater3.jpg',
    },
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
    {
    id: '7',
    title: 'Startup Pitch Night',
    type: 'event',
    content: 'Pitch your startup idea and get feedback from experienced investors.',
    createdAt: '2026-02-05',
    author: {
      name: 'Alice',
      avatar: '/images/avater3.jpg',
    },
    image: 'https://i.pinimg.com/736x/2d/52/aa/2d52aa758ee43991d583879ad0b7c9ea.jpg',
  },
    {
    id: '8',
    title: 'Startup Pitch Night',
    type: 'event',
    content: 'Pitch your startup idea and get feedback from experienced investors.',
    createdAt: '2026-02-05',
    author: {
      name: 'Alice',
      avatar: '/images/avater3.jpg',
    },
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
    {
    id: '9',
    title: 'Startup Pitch Night',
    type: 'event',
    content: 'Pitch your startup idea and get feedback from experienced investors.',
    createdAt: '2026-02-05',
    author: {
      name: 'Alice',
      avatar: '/images/avater3.jpg',
    },
    image: 'https://i.pinimg.com/1200x/d0/48/b8/d048b8341c3f61ebd26138ea61651526.jpg',
  },
];

export default function EventsPage() {
  const isLoading = false;
  const isError = false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and discover all AlikoHub platform events in one place.
              </p>
            </div>

            <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:bg-blue-700 transition">
              <Plus className="w-4 h-4" />
              Create Event
            </button>
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
  );
}
