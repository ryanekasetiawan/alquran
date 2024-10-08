import { useState } from "react";
import { asmaulHusna, AsmaulHusnaType } from "@/utils/asmaulHusna";
import { FaTimes } from "react-icons/fa";
import { webTitle } from "@/utils/webTitle";

const AsmaulHusna = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAsmaulHusna = asmaulHusna.filter((item: AsmaulHusnaType) => {
    const normalizedSearchQuery = searchQuery.toLowerCase().trim();
    return (
      item.urutan.toString().includes(normalizedSearchQuery) ||
      item.latin.toLowerCase().includes(normalizedSearchQuery) ||
      item.arab.toLowerCase().includes(normalizedSearchQuery) ||
      item.arti.toLowerCase().includes(normalizedSearchQuery)
    );
  });

  document.title = `Asmaul Husna - ${webTitle}`;

  return (
    <div className="mt-2 md:mt-5 mx-5 md:mx-12 min-h-[100vh]">
      <div className="sticky z-50 top-16 bg-white pb-2">
        <h1 className="text-xl md:text-2xl font-bold">Daftar Asmaul Husna</h1>

        {/* Input Text Pencarian */}
        <div className="relative flex justify-start gap-4 items-center mt-2 mb-5 lg:mb-5">
          <div className="relative w-[200px] lg:w-[250px]">
            <input
              type="text"
              placeholder="Cari Asmaul Husna"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 "
            />
            {/* Tombol close */}
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
              {filteredAsmaulHusna.length} hasil ditemukan
            </span>
          )}
        </div>
      </div>

      <div>
        <ul className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-center text-white font-semibold">
          {filteredAsmaulHusna.map((item: AsmaulHusnaType) => (
            <li
              key={item.urutan}
              className="bg-[#3daa25] p-2 border rounded-lg"
            >
              <span className="flex gap-1 flex-col items-center text-center flex-start">
                <h2 className="border p-2 rounded-full w-10 h-10 bg-gray-300 flex items-center justify-center text-lg text-black">
                  {item.urutan}.
                </h2>
                <span className="flex gap-1">
                  <p>{item.latin}</p>
                  <p className="arab-font">( {item.arab} )</p>
                </span>
                <p>{item.arti}</p>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AsmaulHusna;
