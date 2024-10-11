import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import SearchInput from "@/components/SearchInput";
import { useFetchSurat, SuratType } from "@/hooks/useFetchSurat";
import { webTitle } from "@/utils/webTitle";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { formatUrl } from "@/utils/formatUrl";

const Quran = () => {
  const { suratList, loading } = useFetchSurat();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleNavigate = (surat: SuratType) => {
    const formattedName = formatUrl(surat.namaLatin);
    navigate(`/quran/surat/${formattedName}`, {
      state: { nomor: surat.nomor },
    });
  };

  const filteredSuratList = suratList.filter((surat: SuratType) => {
    const normalizedSearchQuery: string = searchQuery.toLowerCase().trim();
    return (
      surat.nomor.toString().includes(normalizedSearchQuery) ||
      surat.namaLatin.toLowerCase().includes(normalizedSearchQuery) ||
      surat.arti.toLowerCase().includes(normalizedSearchQuery)
    );
  });

  document.title = `Al-Qur'an - ${webTitle}`;

  return (
    <div className="mt-2 md:mt-5 mx-5 md:mx-12 min-h-[100vh]">
      <div className="sticky z-50 top-16 bg-white pb-2">
        <h1 className="text-xl md:text-2xl font-bold">Daftar Surat</h1>

        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredList={filteredSuratList}
          placeholder="Cari Surat/No. Surat"
        />
      </div>

      {loading ? (
        <LoadingSpinner message="Loading surat..." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredSuratList.map((surat: SuratType) => (
            <Button
              key={surat.nomor}
              onClick={() => handleNavigate(surat)}
              className="px-4 md:px-6 py-4"
            >
              <div className="flex flex-col gap-1 text-center items-center">
                <span className="border p-5 mb-1 rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center bg-gray-300 text-black">
                  {surat.nomor}.
                </span>
                <span className="flex gap-2">
                  <span className="text-base font-semibold">
                    ({surat.namaLatin})
                  </span>
                  <span className="arab-font text-lg">{surat.nama}</span>
                </span>
                <span className="text-sm">
                  ({surat.arti}) - {surat.jumlahAyat} Ayat
                </span>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quran;
