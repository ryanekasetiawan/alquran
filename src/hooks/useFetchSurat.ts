import { useState, useEffect } from "react";
import { get, set } from "idb-keyval";

export type SuratType = {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: {
    [key: string]: string;
  };
};

type CachedData = {
  data: SuratType[];
  timestamp: number;
};

const CACHE_KEY = "suratList";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

export const useFetchSurat = () => {
  const [suratList, setSuratList] = useState<SuratType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchSurat = async () => {
      setLoading(true);
      setError(null);

      try {
        const cachedData = await get<CachedData>(CACHE_KEY);
        const currentTime = Date.now();

        if (cachedData && currentTime - cachedData.timestamp < CACHE_DURATION) {
          setSuratList(cachedData.data);
          return;
        }

        const response = await fetch("https://equran.id/api/v2/surat", {
          signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.data) {
          setSuratList(data.data);
          // Cache the new data
          await set(CACHE_KEY, {
            data: data.data,
            timestamp: currentTime,
          });
        } else {
          throw new Error("Data tidak ditemukan");
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch request was aborted");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan yang tidak diketahui");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSurat();

    return () => controller.abort();
  }, []);

  return { suratList, loading, error };
};
