import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  return (
    <div className="flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden max-w-2xl mx-auto my-12 transition-all focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500">
      <select className="bg-slate-50 px-4 py-3 h-full text-sm font-semibold text-slate-700 border-r border-slate-200 outline-none hover:bg-slate-100 transition-colors">
        <option>All Categories</option>
        <option>Technology</option>
        <option>STEM</option>
        <option>Health</option>
      </select>
      <div className="flex-grow flex items-center px-4">
        <FaSearch className="text-slate-400 mr-3" />
        <input
          type="text"
          placeholder="What do you want to learn today?"
          className="w-full py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
      <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 text-sm font-bold transition-colors">
        Search
      </button>
    </div>
  );
};
export default SearchBar;
