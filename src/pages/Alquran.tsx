import { useState, useRef, useEffect, useCallback } from "react";
import Button from "@/components/ui/button";
import { useFetchSurat, SuratType } from "@/hooks/useFetchSurat";
import { useFetchAyat, AyatType } from "@/hooks/useFetchAyat";
import { useFetchTafsir } from "@/hooks/useFetchTafsir";
import { FaPlay, FaPause, FaStop, FaTimes } from "react-icons/fa";
import { webTitle } from "@/utils/webTitle";

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
  const ayatContainerRef = useRef<HTMLDivElement>(null);
  const [ayatList, setAyatList] = useState<AyatType[]>([]);
  const [loadingAyat, setLoadingAyat] = useState(false);
  const [activeTafsirAyat, setActiveTafsirAyat] = useState<number | null>(null);
  const [displayMode, setDisplayMode] = useState("full");
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
      return <span key={index}>{word}</span>;
    });
  };

  const {
    ayatList: fetchedAyatList,
    loading: loadingAyatFetch,
    error: errorAyat,
  } = useFetchAyat(selectedSurat);

  const {
    tafsirData: tafsir,
    loading: loadingTafsir,
    error: errorTafsir,
    fetchTafsir,
  } = useFetchTafsir();

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
    setLoadingAyat(true);

    setAyatList([]);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleTafsir = async (nomorAyat: number) => {
    if (activeTafsirAyat === nomorAyat) {
      setActiveTafsirAyat(null);
    } else {
      await fetchTafsir(selectedSurat!, nomorAyat);
      setActiveTafsirAyat(nomorAyat);
    }
  };

  useEffect(() => {
    if (ayatContainerRef.current) {
      ayatContainerRef.current.scrollTo(0, 0);
    }
  }, [selectedSurat]);

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

  const nextAyat = useCallback(() => {
    if (currentAyatIndex < ayatList.length - 1) {
      setCurrentAyatIndex((prevIndex) => prevIndex + 1);
    } else {
      stopAudio();
    }
  }, [currentAyatIndex, ayatList]);

  const handleAudioEnded = useCallback(() => {
    nextAyat();
  }, [nextAyat]);

  // Set audio source saat ayat dipilih
  useEffect(() => {
    // Salin nilai audioRef.current ke dalam variabel lokal
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.src = ayatList[currentAyatIndex]?.audio["05"];
      if (isPlaying) {
        audioElement.play();
      }
      audioElement.addEventListener("ended", handleAudioEnded);
    }

    // Cleanup: pastikan referensi yang sama digunakan
    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleAudioEnded);
      }
    };
  }, [currentAyatIndex, ayatList, isPlaying, handleAudioEnded]);

  // Update ayatList saat data berhasil di-fetch
  useEffect(() => {
    if (!loadingAyatFetch && fetchedAyatList.length > 0) {
      setAyatList(fetchedAyatList);
      setLoadingAyat(false); // Set loading false setelah ayat di-fetch
    }
  }, [loadingAyatFetch, fetchedAyatList]);

  const filteredSuratList = suratList.filter((surat: SuratType) => {
    const normalizedSearchQuery: string = searchQuery.toLowerCase().trim();
    const searchWords: string[] = normalizedSearchQuery.split(" ");

    return searchWords.every(
      (word: string) =>
        (surat.nomor && surat.nomor.toString().includes(word)) ||
        (surat.namaLatin && surat.namaLatin.toLowerCase().includes(word)) ||
        (surat.arti && surat.arti.toLowerCase().includes(word)),
    );
  });

  const getButtonWidth = (arti: string) => {
    const charCount = arti.length;
    if (charCount < 10) return "min-w-[200px]";
    if (charCount < 15) return "min-w-[250px]";
    if (charCount < 20) return "min-w-[300px]";
    return "min-w-[350px]";
  };

  if (errorSurat) return <p>{errorSurat}</p>;

  document.title = `Al-Qur'an - ${webTitle}`;

  return (
    <div className="mt-2 md:mt-5 ml-5 md:ml-12">
      <h1 className="text-xl md:text-2xl font-bold">Daftar Surat</h1>

      {/* Input Text Pencarian */}
      <div className="relative flex justify-start gap-4 items-center mt-2 mb-5">
        <div className="relative w-[200px] lg:w-[250px]">
          <input
            type="text"
            placeholder="Cari Surat/No. Surat"
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
            {filteredSuratList.length} hasil ditemukan
          </span>
        )}
      </div>

      {/* Tombol untuk mengubah mode tampilan */}
      <div className="mb-5">
        <Button
          onClick={() =>
            setDisplayMode(displayMode === "full" ? "ayat" : "full")
          }
          className="px-4 py-2"
        >
          {displayMode === "full" ? "Hanya Ayat" : "+ Tafsir & Audio"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5 h-[80vh]">
        {/* Kolom 1: Daftar Surat */}
        <div className="col-span-1 border-r border-l lg:border-none px-2 lg:px-0 lg:pr-5 overflow-y-auto h-full">
          {loadingSurat ? (
            <div className="flex flex-col items-center lg:justify-center mt-12 lg:mt-0 min-h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-500"></div>
              <p>Loading surat...</p>
            </div>
          ) : (
            <div className="flex lg:grid lg:grid-cols-1 lg:gap-5 gap-3 overflow-x-auto whitespace-nowrap lg:overflow-x-visible no-scrollbar">
              {filteredSuratList.map((surat: SuratType) => (
                <Button
                  key={surat.nomor}
                  onClick={() => handleClick(surat.nomor)}
                  isActive={surat.nomor === selectedSurat}
                  disabled={surat.nomor === selectedSurat}
                  className={`${getButtonWidth(surat.arti)} lg:min-w-[250px] max-w-full max-h-[120px] px-4 py-2 lg:py-4 text-left whitespace-normal`}
                >
                  <div className="flex flex-col">
                    <span
                      className={`border p-2 mb-1 rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center ${
                        surat.nomor === selectedSurat
                          ? "bg-[#3daa25] text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {surat.nomor}.
                    </span>
                    <span className="text-base font-semibold">
                      {surat.namaLatin}
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

        {/* Kolom 2: Ayat & Tafsir*/}
        <div
          className="col-span-2 overflow-y-auto h-full"
          ref={ayatContainerRef}
        >
          {selectedSurat ? (
            <div>
              {loadingAyat ? (
                <div className="flex flex-col items-center lg:justify-center mt-12 lg:mt-0 min-h-screen">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-500"></div>
                  <p>Loading ayat...</p>
                </div>
              ) : errorAyat ? (
                <p>{errorAyat}</p>
              ) : (
                ayatList.length > 0 && (
                  <div className="text-right mr-5">
                    {ayatList.map((ayat: AyatType, index: number) => (
                      <div
                        key={ayat.nomorAyat}
                        className="ayat flex flex-col mb-5 border-b py-2"
                        onClick={() => setCurrentAyatIndex(index)}
                      >
                        <div className="flex gap-3 justify-end">
                          <p className="arab-font text-2xl leading-loose">
                            {ayat.teksArab}
                          </p>
                          <p className="border p-2 rounded-full w-10 h-10 flex items-center justify-center bg-gray-200">
                            {ayat.nomorAyat}.
                          </p>
                        </div>

                        {displayMode === "full" && (
                          <div className="flex flex-col gap-1 lg:gap-2 mt-4">
                            <p className="text-[#D946EF]">{ayat.teksLatin}</p>
                            <p>{ayat.teksIndonesia}</p>

                            {/* Audio Buttons */}
                            <div className="flex gap-2 text-sm mt-1">
                              <Button className="px-4 py-2" onClick={playAudio}>
                                <FaPlay />
                              </Button>
                              <Button
                                className="px-4 py-2"
                                onClick={pauseAudio}
                              >
                                <FaPause />
                              </Button>
                              <Button className="px-4 py-2" onClick={stopAudio}>
                                <FaStop />
                              </Button>
                            </div>
                            {/* Button untuk Menampilkan/Tutup Tafsir */}
                            <Button
                              className="px-4 py-2 mt-1"
                              onClick={() => toggleTafsir(ayat.nomorAyat)}
                            >
                              {activeTafsirAyat === ayat.nomorAyat
                                ? "Tutup Tafsir"
                                : "Lihat Tafsir"}
                            </Button>
                          </div>
                        )}

                        {/* Tampilkan Tafsir Jika Ada */}
                        {loadingTafsir &&
                          activeTafsirAyat === ayat.nomorAyat && (
                            <p>Loading tafsir...</p>
                          )}
                        {errorTafsir && activeTafsirAyat === ayat.nomorAyat && (
                          <p>{errorTafsir}</p>
                        )}
                        {activeTafsirAyat === ayat.nomorAyat && tafsir && (
                          <div className="mt-5 border p-4 rounded-md bg-gray-100 text-left">
                            <h3 className="text-lg font-bold">
                              Tafsir Ayat {ayat.nomorAyat}
                            </h3>
                            <p>{renderTextWithDifferentFonts(tafsir.teks)}</p>
                          </div>
                        )}
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
