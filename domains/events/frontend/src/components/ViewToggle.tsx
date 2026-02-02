import { LayoutGrid, List } from 'lucide-react';

export default function ViewToggle() {
  return (
    <div className="flex border rounded-lg overflow-hidden">
      <button className="px-4 py-2 bg-blue-50 text-blue-600">
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button className="px-4 py-2 text-gray-500 hover:bg-gray-50">
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
