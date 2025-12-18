import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  return (
    <div className="md:float-right h-8 ml-10 flex relative md:-bottom-8 rounded-lg overflow-clip mr-10">
      <select className="bg-[#DBB645] px-2 h-full text-sm text-white">
        <option>Explore</option>
        <option>Technology</option>
        <option>STEM</option>
        <option>Health</option>
      </select>
      <input
        type="text"
        placeholder="Search for courses"
        className="bg-[#9C9C9C] p-2 text-sm h-full placeholder-[#577C98] "
      />
      <button className="bg-[#9C9C9C] h-full p-2">
        <FaSearch color="#1C1800" />
      </button>
    </div>
  );
};
export default SearchBar;
