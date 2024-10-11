import { useState } from "react";
import { asmaulHusna, AsmaulHusnaType } from "@/utils/asmaulHusna";
import SearchInput from "@/components/SearchInput";
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

        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredList={filteredAsmaulHusna}
          placeholder="Cari Asmaul Husna"
        />
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
