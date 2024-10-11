import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchAyat } from "@/hooks/useFetchAyat";
import { useFetchTafsir } from "@/hooks/useFetchTafsir";
import { useFetchSurat } from "@/hooks/useFetchSurat";
import SearchAyat from "@/components/SearchAyat";
import Button from "@/components/ui/button";
import Modal from "@/components/Modal";
import AyatItem from "@/components/AyatItem";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import TafsirModal from "@/components/TafsirModal";
import { webTitle } from "@/utils/webTitle";
import { formatUrl } from "@/utils/formatUrl";
import FormattedText from "@/utils/formattedText";
import useModal from "@/utils/useModal";

const SuratDetail = () => {
  const { nomor } = useParams<{ nomor: string }>();
  const { suratList, loading: loadingSurat } = useFetchSurat();
  const nomorSurat = suratList.find(
    (surat) => formatUrl(surat.namaLatin) === nomor,
  )?.nomor;
  const [isChecking, setIsChecking] = useState(true);

  const {
    ayatList,
    namaSurat,
    loading: loadingAyat,
    error,
  } = useFetchAyat(nomorSurat ?? null);

  const {
    tafsirData,
    loading: tafsirLoading,
    error: tafsirError,
    fetchTafsir,
  } = useFetchTafsir();

  const [displayMode, setDisplayMode] = useState<"full" | "ayat">("full");
  const [searchAyat, setSearchAyat] = useState("");

  const [currentAyatIndex, setCurrentAyatIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(new Audio());
  const ayatRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { isModalOpen, modalMessage, showModal, closeModal } = useModal();
  const [showTafsirModal, setShowTafsirModal] = useState(false);
  const [selectedAyat, setSelectedAyat] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleChangeSurat = () => {
    handleAudioControl("stop");
    navigate("/quran");
  };

  const handleSearchAyat = useCallback(
    (ayatNumber: string) => {
      if (!ayatNumber) {
        showModal("Harap masukkan nomor ayat!");
        return;
      }

      const ayatIndex = ayatList.findIndex(
        (ayat) => ayat.nomorAyat === parseInt(ayatNumber),
      );

      if (ayatIndex === -1) {
        showModal("Ayat tidak ditemukan!");
      } else {
        const ayatElement = ayatRefs.current[ayatIndex];
        if (ayatElement) {
          ayatElement.style.scrollMarginTop = "12rem";
          ayatElement.scrollIntoView({ behavior: "smooth", block: "start" });
          setCurrentAyatIndex(ayatIndex);
        }
      }
    },
    [ayatList, ayatRefs, showModal],
  );

  const isInvalidSurat =
    !isNaN(Number(nomor)) ||
    suratList.every((surat) => formatUrl(surat.namaLatin) !== nomor);

  useEffect(() => {
    if (!loadingSurat) {
      if (isInvalidSurat) {
        setIsChecking(true);
        navigate("/404", { replace: true });
      } else {
        setIsChecking(false);
      }
    }
  }, [loadingSurat, isInvalidSurat, navigate]);

  useEffect(() => {
    if (ayatList.length > 0 && audioRef.current) {
      audioRef.current.src = ayatList[0]?.audio["05"];
      audioRef.current.load();
    }
  }, [ayatList]);

  const handleToggleMode = () => {
    handleAudioControl("stop");
    const newMode = displayMode === "full" ? "ayat" : "full";
    setDisplayMode(newMode);
    if (audioRef.current && ayatList[currentAyatIndex]) {
      audioRef.current.src = ayatList[currentAyatIndex].audio["05"];
      audioRef.current.load();
    }
  };

  const handleAudioControl = useCallback(
    (action: "play" | "pause" | "stop", index?: number) => {
      if (!audioRef.current) return;

      if (action === "play" && index !== undefined) {
        if (currentAyatIndex !== index) {
          audioRef.current.src = ayatList[index]?.audio["05"];
          audioRef.current.load();
        }
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setCurrentAyatIndex(index);
          })
          .catch(console.error);
      } else if (action === "pause") {
        audioRef.current.pause();
        setIsPlaying(false);
      } else if (action === "stop") {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    },
    [ayatList, currentAyatIndex],
  );

  const handleAudioEnded = useCallback(() => {
    if (currentAyatIndex < ayatList.length - 1 && isPlaying) {
      handleAudioControl("play", currentAyatIndex + 1);
    } else {
      handleAudioControl("stop");
    }
  }, [currentAyatIndex, isPlaying, ayatList, handleAudioControl]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("ended", handleAudioEnded);
      return () => {
        audioElement.removeEventListener("ended", handleAudioEnded);
      };
    }
  }, [handleAudioEnded]);

  useEffect(() => {
    if (ayatRefs.current[currentAyatIndex]) {
      ayatRefs.current[currentAyatIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentAyatIndex]);

  const handleOpenTafsir = useCallback(
    (ayatNumber: number) => {
      setSelectedAyat(ayatNumber);
      setShowTafsirModal(true);
      fetchTafsir(nomorSurat!, ayatNumber);
    },
    [fetchTafsir, nomorSurat],
  );

  const handleCloseTafsir = useCallback(() => {
    setShowTafsirModal(false);
    setSelectedAyat(null);
  }, []);

  if (error) {
    return <p className="text-red-500">Terjadi kesalahan: {error}</p>;
  }

  if (isChecking) {
    return <LoadingSpinner />;
  }

  const title = namaSurat || "Surat";

  document.title = `${title} - ${webTitle}`;

  return (
    <div className="mt-2 md:mt-5 px-5 md:px-12 min-h-[100vh]">
      <div className="sticky top-16 bg-white pb-2 z-[90]">
        <div className="flex justify-between mb-2">
          <h1 className="text-xl md:text-2xl font-bold mb-2">
            Surat {loadingAyat ? <span>Loading...</span> : namaSurat}
          </h1>
          <Button className="bg-blue-500 md:hidden" onClick={handleChangeSurat}>
            Ganti Surat
          </Button>
        </div>
        <div className="flex justify-between md:justify-start gap-2 md:gap-5 mb-2 md:mb-5">
          <Button
            className="bg-blue-500 hidden md:block"
            onClick={handleChangeSurat}
          >
            Ganti Surat
          </Button>
          <Button onClick={handleToggleMode} className="px-4 py-2">
            {displayMode === "full" ? "Hanya Ayat" : "+ Tafsir & Audio"}
          </Button>
          <div className="relative flex gap-2 justify-start items-center">
            <SearchAyat
              searchAyat={searchAyat}
              setSearchAyat={setSearchAyat}
              onSearch={() => handleSearchAyat(searchAyat)}
            />
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
      <audio ref={audioRef} />
      {loadingAyat ? (
        <LoadingSpinner message="Loading ayat..." />
      ) : (
        <div className="">
          {ayatList.map((ayat, index) => (
            <AyatItem
              key={ayat.nomorAyat}
              ayat={ayat}
              index={index}
              currentAyatIndex={currentAyatIndex}
              isPlaying={isPlaying}
              handleAudioControl={handleAudioControl}
              handleOpenTafsir={handleOpenTafsir}
              displayMode={displayMode}
              ayatRefs={ayatRefs}
            />
          ))}
        </div>
      )}
      {showTafsirModal && (
        <TafsirModal
          show={showTafsirModal}
          onClose={handleCloseTafsir}
          tafsirData={<FormattedText text={tafsirData?.teks ?? ""} />}
          loading={tafsirLoading}
          error={tafsirError}
          ayatNumber={selectedAyat}
        />
      )}
    </div>
  );
};

export default SuratDetail;
