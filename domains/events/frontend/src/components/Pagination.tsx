import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination() {
  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      <button className="p-2 border rounded-lg">
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">1</button>
      <button className="px-4 py-2 rounded-lg border">2</button>
      <button className="px-4 py-2 rounded-lg border">3</button>

      <button className="p-2 border rounded-lg">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
