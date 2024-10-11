import { useState } from "react";
import { get, set } from "idb-keyval";

type TafsirData = {
  ayat: number;
  teks: string;
};

type AudioFull = {
  [key: string]: string;
};

type TafsirResponse = {
  code: number;
  message: string;
  data: {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    tempatTurun: string;
    arti: string;
    deskripsi: string;
    audioFull: AudioFull;
    tafsir: TafsirData[];
  };
};

type CachedTafsirData = {
  data: TafsirData;
  timestamp: number;
};

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

const getCacheKey = (surahId: number, ayatId: number) =>
  `tafsir_${surahId}_${ayatId}`;

export const useFetchTafsir = () => {
  const [tafsirData, setTafsirData] = useState<TafsirData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTafsir = async (surahId: number, ayatId: number) => {
    if (!surahId || !ayatId) return;
    setLoading(true);
    setError(null);

    const cacheKey = getCacheKey(surahId, ayatId);
    const currentTime = Date.now();

    const controller = new AbortController();
    const { signal } = controller;

    try {
      const cachedData = await get<CachedTafsirData>(cacheKey);

      if (cachedData && currentTime - cachedData.timestamp < CACHE_DURATION) {
        setTafsirData(cachedData.data);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://equran.id/api/v2/tafsir/${surahId}`,
        { signal },
      );
      const data: TafsirResponse = await response.json();

      if (response.ok) {
        const tafsirAyat = data.data.tafsir.find(
          (tafsir) => tafsir.ayat === ayatId,
        );

        if (tafsirAyat) {
          setTafsirData(tafsirAyat);
          await set(cacheKey, {
            data: tafsirAyat,
            timestamp: currentTime,
          });
        } else {
          throw new Error("Tafsir untuk ayat ini tidak ditemukan.");
        }
      } else {
        throw new Error(data.message || "Gagal mengambil tafsir.");
      }
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Fetch request was aborted");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Terjadi kesalahan saat mengambil tafsir.");
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

  return { tafsirData, loading, error, fetchTafsir };
};
