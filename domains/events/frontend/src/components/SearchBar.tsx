import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search events by title or manager..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
