import { useEffect, useState } from "react";
import { useFetchDoa, Doa } from "@/hooks/useFetchDoa";
import Button from "@/components/ui/button";

const Doa = () => {
  const [doas, setDoas] = useState<Doa[]>([]);
  const [selectedDoa, setSelectedDoa] = useState<number | null>(null);
  const [loadingDoa, setLoadingDoa] = useState(true); // State untuk loading daftar doa
  const [loadingSelectedDoa, setLoadingSelectedDoa] = useState(false); // State untuk loading detail doa
  const [detailDoa, setDetailDoa] = useState<Doa | null>(null); // State untuk menyimpan detail doa

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
      }
    } catch (error) {
      console.error("Gagal mengambil detail doa:", error);
    } finally {
      setLoadingSelectedDoa(false); // Matikan loading setelah data detail berhasil di-fetch
    }
  };

  return (
    <div className="ml-12">
      <h1 className="text-2xl font-bold">Daftar Doa</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 my-8 h-[80vh]">
        {/* Kolom 1: Daftar Doa */}
        <div className="col-span-1 border-r pr-5 overflow-y-auto h-full">
          {loadingDoa ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-500"></div>
              <p>Loading doa...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {doas.map((doa) => (
                <Button
                  key={doa.id}
                  onClick={() => handleClick(doa.id)}
                  isActive={doa.id === selectedDoa}
                >
                  <span className="flex items-center text-center justify-start gap-5">
                    <span
                      className={`border p-2 rounded-full ${doa.id === selectedDoa ? "bg-[#3daa25] text-white" : "bg-gray-300 text-black"}`}
                    >
                      {doa.id}.
                    </span>
                    <span className="flex flex-col">
                      <span>{doa.nama}</span>
                    </span>
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Kolom 2: Detail Doa yang Dipilih */}
        <div className="col-span-2 overflow-y-auto h-full">
          {selectedDoa !== null ? (
            loadingSelectedDoa ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-500"></div>
                <p>Loading detail doa...</p>
              </div>
            ) : detailDoa ? (
              <div className="flex flex-col gap-y-3 mb-5 border-b py-2">
                <h2 className="text-xl text-right mr-8 mb-5">
                  {detailDoa.nama}
                </h2>
                <p className="text-2xl text-right mr-8 arab-font">
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
  );
};

export default Doa;
