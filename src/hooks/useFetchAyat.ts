import { useState, useEffect } from "react";

export type Ayat = {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: {
    [key: string]: string;
  };
};

export const useFetchAyat = (suratNomor: number | null) => {
  const [ayatList, setAyatList] = useState<Ayat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAyat = async () => {
      if (suratNomor === null) return;

      setLoading(true);
      try {
        const response = await fetch(
          `https://equran.id/api/v2/surat/${suratNomor}`,
        );
        const data = await response.json();

        if (response.ok) {
          setAyatList(data.data.ayat);
          setError(null);
        } else {
          throw new Error(data.message || "Failed to fetch");
        }
      } catch (err) {
        console.error("Error fetching ayat:", err);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAyat();
  }, [suratNomor]);

  return { ayatList, loading, error };
};
