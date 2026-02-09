import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="w-full flex justify-start">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

        <input
          type="text"
          placeholder="Search events by title or manager..."
          className="w-full pl-11 pr-4 py-3 text-sm
                     bg-bule-50
                     border border-gray-200
                     rounded-full
                     shadow-lg
                     text-gray-800
                     placeholder-blue-400
                     focus:outline-none
                     focus:ring-2 focus:ring-blue-400
                     focus:border-transparent"
        />
      </div>
    </div>
  );
}
