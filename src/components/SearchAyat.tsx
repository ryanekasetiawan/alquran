import { FaTimes } from "react-icons/fa";
import Button from "./ui/button";

type SearchAyatProps = {
  searchAyat: string;
  setSearchAyat: (value: string) => void;
  onSearch: () => void;
};

const SearchAyat = ({
  searchAyat,
  setSearchAyat,
  onSearch,
}: SearchAyatProps) => {
  return (
    <>
      <div className="relative w-[100px] md:w-[200px]">
        <input
          type="number"
          placeholder="Cari Ayat"
          value={searchAyat}
          onChange={(e) => setSearchAyat(e.target.value)}
          className="border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500 px-2 py-3"
        />
        {searchAyat && (
          <button
            onClick={() => setSearchAyat("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-600"
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>
      <Button onClick={onSearch}>Cari</Button>
    </>
  );
};

export default SearchAyat;
