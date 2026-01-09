import { useState } from 'react';

const QuickSearch = () => {
  const [search, setSearch] = useState('');

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4">Quick Search</h2>
      <input
        type="text"
        placeholder="Search tasks, documents, or team"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <div className="flex space-x-2 mt-2">
        <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">High Priority</button>
        <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Due Today</button>
        <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Blueprints</button>
      </div>
    </section>
  );
};

export default QuickSearch;