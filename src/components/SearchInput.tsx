import { FaTimes } from "react-icons/fa";

type SearchInputProps<T> = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredList: T[];
  placeholder: string;
};

const SearchInput = <T,>({
  searchQuery,
  setSearchQuery,
  filteredList,
  placeholder,
}: SearchInputProps<T>) => {
  return (
    <div className="relative flex justify-start gap-4 items-center mt-2 mb-5">
      <div className="relative w-[200px] lg:w-[250px]">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-3 text-red-500 hover:text-red-600"
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>
      {searchQuery && (
        <span className="text-gray-600">
          {filteredList.length} hasil ditemukan
        </span>
      )}
    </div>
  );
};

export default SearchInput;
