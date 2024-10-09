import { useState, useEffect } from "react";
import { get, set } from "idb-keyval";

export type DoaType = {
  id: number;
  grup: string;
  nama: string;
  ar: string;
  tr: string;
  idn: string;
  tentang: string;
  mood: string;
  tag: string;
};

type CachedDoaData = {
  data: DoaType[];
  timestamp: number;
};

const CACHE_KEY = "doaList";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

export const useFetchDoa = () => {
  const [doas, setDoas] = useState<DoaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoa = async () => {
      try {
        const currentTime = Date.now();
        const cachedData: CachedDoaData | undefined =
          await get<CachedDoaData>(CACHE_KEY);

        if (cachedData && currentTime - cachedData.timestamp < CACHE_DURATION) {
          setDoas(cachedData.data);
        } else {
          const response = await fetch("https://equran.id/api/doa");
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          setDoas(data);
          await set(CACHE_KEY, {
            data,
            timestamp: currentTime,
          });
        }

        setError(null);
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDoa();
  }, []);

  return { doas, loading, error };
};
