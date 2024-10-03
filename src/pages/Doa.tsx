import { useEffect, useState, useRef } from "react";
import { useFetchDoa, DoaType } from "@/hooks/useFetchDoa";
import Button from "@/components/ui/button";

const Doa = () => {
  const [doas, setDoas] = useState<DoaType[]>([]);
  const [selectedDoa, setSelectedDoa] = useState<number | null>(null);
  const [loadingDoa, setLoadingDoa] = useState(true); // State untuk loading daftar doa
  const [loadingSelectedDoa, setLoadingSelectedDoa] = useState(false); // State untuk loading detail doa
  const [detailDoa, setDetailDoa] = useState<DoaType | null>(null); // State untuk menyimpan detail doa
  const detailDoaRef = useRef<HTMLDivElement>(null); // Ref untuk detail doa
  const [searchQuery, setSearchQuery] = useState(""); // State untuk kata kunci pencarian

  useEffect(() => {
    const getDoa = async () => {
      setLoadingDoa(true); // Set loading saat mem-fetch data doa
      const data = await useFetchDoa();
      setDoas(data);
      setLoadingDoa(false); // Matikan loading setelah data berhasil di-fetch

      // Set default selectedDoa ke ID 1 jika ada doa
      if (data.length > 0) {
        setSelectedDoa(1); // Atur selectedDoa ke 1 terlebih dahulu
        setDetailDoa(data[0]); // Atur detail doa pertama sebagai default
      }
    };

    getDoa();
  }, []);

  const handleClick = async (id: number) => {
    setLoadingSelectedDoa(true); // Set loading saat detail doa sedang di-fetch

    try {
      const selected = doas.find((doa) => doa.id === id);
      if (selected) {
        setSelectedDoa(id);
        setDetailDoa(selected); // Simpan detail doa yang dipilih

        // Scroll ke bagian detail doa
        if (detailDoaRef.current) {
          detailDoaRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (error) {
      console.error("Gagal mengambil detail doa:", error);
    } finally {
      setLoadingSelectedDoa(false); // Matikan loading setelah data detail berhasil di-fetch
    }
  };

  // Filter daftar doa berdasarkan kata kunci pencarian
  const filteredDoas = doas.filter((doa: DoaType) => {
    const normalizedSearchQuery: string = searchQuery.toLowerCase().trim();
    const searchWords: string[] = normalizedSearchQuery.split(" ");

    return searchWords.every(
      (word: string) =>
        (doa.nama && doa.nama.toLowerCase().includes(word)) ||
        (doa.grup && doa.grup.toLowerCase().includes(word)) ||
        (doa.mood && doa.mood.toLowerCase().includes(word)) ||
        (doa.tag && doa.tag.toLowerCase().includes(word)),
    );
  });

  const getButtonWidth = (nama: string) => {
    const wordCount = nama.split(" ").length; // Hitung jumlah kata
    if (wordCount < 5) {
      return "min-w-[250px]";
    } else if (wordCount < 10) {
      return "min-w-[300px]";
    } else if (wordCount < 15) {
      return "min-w-[400px]";
    } else if (wordCount < 20) {
      return "min-w-[450px]";
    } else {
      return "min-w-[600px]";
    }
  };

  return (
    <div className="mt-5 ml-5 md:ml-12">
      {/*<div className="flex">*/}
      <h1 className="text-2xl font-bold">Daftar Doa</h1>

      {/* Input Text Pencarian */}
      <div className="flex justify-start gap-4 items-center mt-2 mb-5 lg:mb-5">
        <input
          type="text"
          placeholder="Cari Doa"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[200px] p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        {searchQuery && (
          <span className="text-gray-600">
            {filteredDoas.length} hasil ditemukan
          </span>
        )}
      </div>
      {/*</div>*/}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5 h-[80vh]">
        {/* Kolom 1: Daftar Doa */}
        <div className="col-span-1 border-r border-l lg:border-none px-2 lg:pr-5 overflow-y-auto h-full">
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
                  className={`${getButtonWidth(doa.nama)} lg:min-w-[200px] max-w-full max-h-[100px] lg:max-h-[200px] px-4 py-1 text-left whitespace-normal`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold">{doa.nama}</span>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Kolom 2: Detail Doa yang Dipilih */}
        <div className="col-span-2 overflow-y-auto h-full">
          <div ref={detailDoaRef}>
            {selectedDoa !== null ? (
              loadingSelectedDoa ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-500"></div>
                  <p>Loading detail doa...</p>
                </div>
              ) : detailDoa ? (
                <div className="flex flex-col gap-y-3 mb-5 border-b mr-5 py-2">
                  <h2 className="text-xl text-right mb-5">{detailDoa.nama}</h2>
                  <p className="text-2xl text-right arab-font">
                    {detailDoa.ar}
                  </p>
                  <p className="text-[#D946EF]">{detailDoa.tr}</p>
                  <p>{detailDoa.idn}</p>
                  <p className="mt-3 italic">{detailDoa.tentang}</p>
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
