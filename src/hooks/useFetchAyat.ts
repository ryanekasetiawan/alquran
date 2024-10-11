import { useState, useEffect } from "react";
import { get, set } from "idb-keyval";

export type AyatType = {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: { [key: string]: string };
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!suratNomor) return;

    const fetchAyat = async (suratNomor: number) => {
      const cacheKey = getCacheKey(suratNomor);
      setLoading(true);
      setError(null);

      try {
        const cachedData = await get<CachedAyatData>(cacheKey);
        const now = Date.now();

        if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
          setAyatList(cachedData.data);
          setNamaSurat(cachedData.namaSurat);
          setLoading(false);
          return;
        }
      } catch (cacheError) {
        console.error("Cache retrieval failed", cacheError);
      }

      const controller = new AbortController();
      const { signal } = controller;

      try {
        const response = await fetch(
          `https://equran.id/api/v2/surat/${suratNomor}`,
          { signal },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && Array.isArray(data.data.ayat)) {
          const ayatData = data.data.ayat;
          const retrievedNamaSurat = data.data.namaLatin;

          setAyatList(ayatData);
          setNamaSurat(retrievedNamaSurat || "Nama tidak tersedia");

          await set(cacheKey, {
            data: ayatData,
            namaSurat: retrievedNamaSurat,
            timestamp: Date.now(),
          });
        } else {
          throw new Error("Data tidak valid atau surat tidak ditemukan");
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          console.log("Fetch request aborted");
        } else {
          setError(
            error instanceof Error ? error.message : "Kesalahan jaringan",
          );
        }
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    };

    fetchAyat(suratNomor);
  }, [suratNomor]);

  return { ayatList, namaSurat, loading, error };
};
