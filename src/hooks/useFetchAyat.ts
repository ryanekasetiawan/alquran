import { useState, useEffect } from "react";
import { get, set } from "idb-keyval";

export type AyatType = {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: {
    [key: string]: string;
  };
};

type CachedAyatData = {
  data: AyatType[];
  namaSurat: string;
  timestamp: number;
};

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

const getCacheKey = (suratNomor: number) => `ayatList_surat_${suratNomor}`;

export const useFetchAyat = (suratNomor: number | null) => {
  const [ayatList, setAyatList] = useState<AyatType[]>([]);
  const [namaSurat, setNamaSurat] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAyat = async (suratNomor: number) => {
      if (!suratNomor) {
        return;
      }

      const cacheKey = getCacheKey(suratNomor);
      const cachedData = await get<CachedAyatData>(cacheKey);

      setLoading(true);

      const now = Date.now();

      if (cachedData) {
        if (now - cachedData.timestamp < CACHE_DURATION) {
          setAyatList(cachedData.data);
          setNamaSurat(cachedData.namaSurat);
          setLoading(false);
          return;
        } else {
          await set(cacheKey, undefined);
        }
      }

      try {
        const response = await fetch(
          `https://equran.id/api/v2/surat/${suratNomor}`,
        );
        const data = await response.json();

        if (response.ok && data.data && Array.isArray(data.data.ayat)) {
          setAyatList(data.data.ayat);
          const retrievedNamaSurat = data.data.namaLatin;
          setNamaSurat(retrievedNamaSurat);

          await set(cacheKey, {
            data: data.data.ayat,
            namaSurat: retrievedNamaSurat || "Nama tidak tersedia",
            timestamp: Date.now(),
          });
        } else {
          throw new Error(data.message || "Surat tidak ditemukan");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Terjadi kesalahan yang tidak diketahui");
        }
      } finally {
        setLoading(false);
      }
    };

    if (suratNomor) {
      fetchAyat(suratNomor);
    }
  }, [suratNomor]);

  return { ayatList, namaSurat, loading, error };
};
