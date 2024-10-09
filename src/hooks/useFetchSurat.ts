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
    const fetchSurat = async () => {
      setLoading(true);
      try {
        const cachedData: CachedData | undefined =
          await get<CachedData>(CACHE_KEY);

        const currentTime = Date.now();

        if (cachedData && currentTime - cachedData.timestamp < CACHE_DURATION) {
          setSuratList(cachedData.data);
        } else {
          const response = await fetch("https://equran.id/api/v2/surat");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSuratList(data.data);

          await set(CACHE_KEY, {
            data: data.data,
            timestamp: currentTime,
          });
        }

        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error fetching data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSurat();
  }, []);

  return { suratList, loading, error };
};
