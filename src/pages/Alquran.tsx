import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/button";
import { useFetchSurat, SuratType } from "@/hooks/useFetchSurat";
import { useFetchAyat, AyatType } from "@/hooks/useFetchAyat";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
// import { FaQuran } from "react-icons/fa";

const Alquran = () => {
  const {
    suratList,
    loading: loadingSurat,
    error: errorSurat,
  } = useFetchSurat();
  const [selectedSurat, setSelectedSurat] = useState<number | null>(null);
  const [currentAyatIndex, setCurrentAyatIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mengambil ayat dari custom hook berdasarkan surat yang dipilih
  const {
    ayatList,
    loading: loadingAyat,
    error: errorAyat,
  } = useFetchAyat(selectedSurat);

  // Set surat pertama sebagai default saat surat berhasil dimuat
  useEffect(() => {
    if (suratList.length > 0) {
      const firstSuratNomor = suratList[0].nomor;
      handleClick(firstSuratNomor);
    }
  }, [suratList]);

  // Mengambil ayat saat surat dipilih
  const handleClick = (suratNomor: number) => {
    setSelectedSurat(suratNomor);
    setCurrentAyatIndex(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Play, pause, dan stop audio
  const playAudio = () => {
    if (!isPlaying && audioRef.current) {
      setIsPlaying(true);
      audioRef.current.play();
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentAyatIndex(0);
  };

  const handleAudioEnded = () => {
    nextAyat();
  };

  const nextAyat = () => {
    if (currentAyatIndex < ayatList.length - 1) {
      setCurrentAyatIndex(currentAyatIndex + 1);
    } else {
      stopAudio();
    }
  };

  // Set audio source saat ayat dipilih
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = ayatList[currentAyatIndex]?.audio["05"];
      if (isPlaying) {
        audioRef.current.play();
      }
      audioRef.current.addEventListener("ended", handleAudioEnded);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnded);
      }
    };
  }, [currentAyatIndex, ayatList, isPlaying]);

  // Handle loading dan error states
  // if (loadingSurat)
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
  //     </div>
  //   );
  if (errorSurat) return <p>{errorSurat}</p>;

  return (
    <div className="ml-12">
      <h1 className="text-2xl font-bold">Daftar Surat</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 my-8 h-[80vh]">
        {/* Kolom 1: Daftar Surat */}
        <div className="col-span-1 border-r pr-5 overflow-y-auto h-full">
          {loadingSurat ? (
            <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-500"></div>
              <p>Loading surat...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {suratList.map((surat: SuratType) => (
                <Button
                  key={surat.nomor}
                  onClick={() => handleClick(surat.nomor)}
                  isActive={surat.nomor === selectedSurat}
                >
                  <span className="flex items-center text-center justify-start gap-5">
                    <span
                      className={`border p-2 rounded-full ${surat.nomor === selectedSurat ? "bg-[#3daa25] text-white" : "bg-gray-300 text-black"}`}
                    >
                      {surat.nomor}.
                    </span>
                    <span className="flex flex-col">
                      <span>{surat.namaLatin}</span>
                      <span>
                        ({surat.arti}) {surat.jumlahAyat} - Ayat
                      </span>
                    </span>
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Kolom 2 dan 3: Ayat yang dipilih */}
        <div className="col-span-2 overflow-y-auto h-full">
          {selectedSurat ? (
            <div>
              {loadingAyat ? (
                <div className="flex flex-col items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-500"></div>
                  <p>Loading ayat...</p>
                </div>
              ) : errorAyat ? (
                <p>{errorAyat}</p>
              ) : (
                ayatList.length > 0 && (
                  <div className=" text-right mr-8">
                    {ayatList.map((ayat: AyatType, index: number) => (
                      <div
                        id={`ayat-${index}`}
                        key={ayat.nomorAyat}
                        className="ayat flex flex-col mb-5 border-b py-2"
                        onClick={() => setCurrentAyatIndex(index)}
                      >
                        <div className="flex gap-3 justify-end">
                          <p className="arab-font text-2xl">{ayat.teksArab}</p>
                          <p className="border rounded-xl px-3 py-2 bg-slate-200">
                            {ayat.nomorAyat}.
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 mt-5 text-lg">
                          <p className="text-[#D946EF]">{ayat.teksLatin}</p>
                          <p>{ayat.teksIndonesia}</p>
                          <div className="flex gap-2">
                            <Button onClick={playAudio}>
                              <FaPlay />
                            </Button>
                            <Button onClick={pauseAudio}>
                              <FaPause />
                            </Button>
                            <Button onClick={stopAudio}>
                              <FaStop />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          ) : (
            <p>Pilih surat untuk menampilkan ayat-ayatnya</p>
          )}
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default Alquran;
