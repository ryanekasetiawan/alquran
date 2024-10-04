import { useState, useEffect } from "react";

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

export const useFetchDoa = () => {
  const [doas, setDoas] = useState<DoaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoa = async () => {
      try {
        const response = await fetch("https://equran.id/api/doa");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setDoas(data);
      } catch (err) {
        const errorMessage = (err as Error).message;
        console.error("Error fetching data:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDoa();
  }, []); // Kosongkan dependency array agar hanya dijalankan sekali saat mount

  return { doas, loading, error };
};
