import { useEffect, useState, useRef } from "react";
import { useFetchDoa, DoaType } from "@/hooks/useFetchDoa";
import Button from "@/components/ui/button";
import { FaTimes } from "react-icons/fa";
import { webTitle } from "@/utils/webTitle";

const Doa = () => {
  const { doas, loading: loadingDoa, error } = useFetchDoa();
  const [selectedDoa, setSelectedDoa] = useState<number | null>(null);
  const [loadingSelectedDoa, setLoadingSelectedDoa] = useState(false);
  const [detailDoa, setDetailDoa] = useState<DoaType | null>(null);
  const detailDoaRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;

  const renderTextWithDifferentFonts = (text: string) => {
    return text.split(/(\s+)/).map((word, index) => {
      if (arabicRegex.test(word)) {
        return (
          <span key={index} className="arab-font text-xl">
            {word}
          </span>
        );
      }
      return (
        <span key={index} className="italic">
          {word}
        </span>
      );
    });
  };

  useEffect(() => {
    if (doas.length > 0) {
      setSelectedDoa(doas[0].id);
      setDetailDoa(doas[0]);
    }
  }, [doas]);

  const handleClick = async (id: number) => {
    setLoadingSelectedDoa(true);

    try {
      const selected = doas.find((doa) => doa.id === id);
      if (selected) {
        setSelectedDoa(id);
        setDetailDoa(selected);

        if (detailDoaRef.current) {
          detailDoaRef.current.scrollTo(0, 0);
        }
      }
    } catch (error) {
      console.error("Gagal mengambil detail doa:", error);
    } finally {
      setLoadingSelectedDoa(false);
    }
  };

  // Filter doa berdasarkan pencarian
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

  const getButtonWidth = (nama: string) => {
    const wordCount = nama.split(" ").length;
    if (wordCount < 5) return "min-w-[250px]";
    if (wordCount < 10) return "min-w-[300px]";
    if (wordCount < 15) return "min-w-[400px]";
    if (wordCount < 20) return "min-w-[450px]";
    return "min-w-[600px]";
  };

  document.title = `Doa - ${webTitle}`;

  return (
    <div className="mt-2 md:mt-5 ml-5 md:ml-12">
      <h1 className="text-xl md:text-2xl font-bold">Daftar Doa</h1>
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* Tampilkan pesan error */}
      <div className="relative flex justify-start gap-4 items-center mt-2 mb-5 lg:mb-5">
        <div className="relative w-[200px] lg:w-[250px]">
          <input
            type="text"
            placeholder="Cari Doa"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
            {filteredDoas.length} hasil ditemukan
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5 h-[80vh]">
        <div className="col-span-1 border-r border-l lg:border-none px-2 lg:px-0 lg:pr-5 overflow-y-auto h-full">
          {loadingDoa ? (
            <div className="flex flex-col items-center lg:justify-center mt-12 lg:mt-0 min-h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-500"></div>
              <p>Loading doa...</p>
            </div>
          ) : (
            <div className="flex lg:grid lg:grid-cols-1 lg:gap-5 gap-3 overflow-x-auto whitespace-nowrap lg:overflow-x-visible no-scrollbar">
              {filteredDoas.map((doa) => (
                <Button
                  key={doa.id}
                  onClick={() => handleClick(doa.id)}
                  isActive={doa.id === selectedDoa}
                  disabled={doa.id === selectedDoa}
                  className={`${getButtonWidth(doa.nama)} lg:min-w-[200px] max-w-full max-h-[100px] lg:max-h-[200px] px-4 py-4 lg:py-5 text-left whitespace-normal`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">{doa.nama}</span>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-2 overflow-y-auto h-full">
          <div ref={detailDoaRef}>
            {selectedDoa !== null ? (
              loadingSelectedDoa ? (
                <div className="flex flex-col items-center lg:justify-center mt-12 lg:mt-0 h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-500"></div>
                  <p>Loading detail doa...</p>
                </div>
              ) : detailDoa ? (
                <div className="flex flex-col gap-y-5 mb-5 border-b mr-5 py-2">
                  <h2 className="text-xl text-right mb-5">{detailDoa.nama}</h2>
                  <p className="text-2xl text-right arab-font">
                    {detailDoa.ar}
                  </p>
                  <p className="text-[#D946EF]">{detailDoa.tr}</p>
                  <p>{detailDoa.idn}</p>
                  <p className="mt-2">
                    {renderTextWithDifferentFonts(detailDoa.tentang)}
                  </p>
                </div>
              ) : (
                <p>Doa tidak ditemukan</p>
              )
            ) : (
              <p>Pilih doa untuk menampilkan detailnya</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doa;
