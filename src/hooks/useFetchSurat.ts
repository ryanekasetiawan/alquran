import { useState, useEffect } from "react";

// Tipe data untuk surat
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

// Custom hook untuk mengambil data surat
export const useFetchSurat = () => {
  const [suratList, setSuratList] = useState<SuratType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurat = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://equran.id/api/v2/surat");
        const data = await response.json();
        setSuratList(data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching surat:", err);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchSurat();
  }, []);

  return { suratList, loading, error };
};
