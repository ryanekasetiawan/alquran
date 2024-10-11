import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchDoa, DoaType } from "@/hooks/useFetchDoa";
import Button from "@/components/ui/button";
import SearchInput from "@/components/SearchInput";
import { webTitle } from "@/utils/webTitle";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { formatUrl } from "@/utils/formatUrl";

const Doa = () => {
  const { doas, loading } = useFetchDoa();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleNavigate = (doa: DoaType) => {
    const formattedName = formatUrl(doa.nama);
    navigate(`/doa/${formattedName}`, { state: { id: doa.id } });
  };

  const filteredDoas = doas.filter((doa) => {
    const normalizedSearchQuery = searchQuery.toLowerCase().trim();
    const searchWords = normalizedSearchQuery.split(" ");
    return searchWords.every(
      (word) =>
        (doa.nama && doa.nama.toLowerCase().includes(word)) ||
        (doa.grup && doa.grup.toLowerCase().includes(word)) ||
        (doa.mood && doa.mood.toLowerCase().includes(word)) ||
        (doa.tag && doa.tag.toLowerCase().includes(word)),
    );
  });

  document.title = `Doa - ${webTitle}`;

  return (
    <div className="mt-2 md:mt-5 mx-5 md:mx-12 min-h-[100vh] ">
      <div className="sticky z-50 top-16 bg-white pb-2">
        <h1 className="text-xl md:text-2xl font-bold">Daftar Doa</h1>

        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredList={filteredDoas}
          placeholder="Cari Doa"
        />
      </div>

      {loading ? (
        <LoadingSpinner message="Loading doa..." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredDoas.map((doa) => (
            <Button
              key={doa.id}
              onClick={() => handleNavigate(doa)}
              className="px-4 md:px-6 py-4"
            >
              <div className="flex flex-col gap-1 text-center items-center">
                <span className="border p-5 mb-1 rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center bg-gray-300 text-black">
                  {doa.id}.
                </span>
                <span className="text-base font-semibold">{doa.nama}</span>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doa;
