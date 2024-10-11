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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchDoa = async () => {
      setLoading(true);
      setError(null);

      try {
        const currentTime = Date.now();
        const cachedData: CachedDoaData | undefined =
          await get<CachedDoaData>(CACHE_KEY);

        if (cachedData && currentTime - cachedData.timestamp < CACHE_DURATION) {
          setDoas(cachedData.data);
          setLoading(false);
          return;
        }

        const response = await fetch("https://equran.id/api/doa", { signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setDoas(data);
          await set(CACHE_KEY, {
            data,
            timestamp: currentTime,
          });
        } else {
          throw new Error("Data tidak valid");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch request was aborted");
        } else {
          setError(
            (err as Error).message || "Terjadi kesalahan saat mengambil data",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoa();

    return () => controller.abort();
  }, []);

  return { doas, loading, error };
};
