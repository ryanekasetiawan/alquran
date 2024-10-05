import { useState } from "react";

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

export const useFetchTafsir = () => {
  const [tafsirData, setTafsirData] = useState<TafsirData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTafsir = async (surahId: number, ayatId: number) => {
    setLoading(true);
    setTafsirData(null); // reset tafsir saat loading
    try {
      const response = await fetch(
        `https://equran.id/api/v2/tafsir/${surahId}`,
      );
      const data: TafsirResponse = await response.json();

      if (response.ok) {
        const tafsirAyat = data.data.tafsir.find(
          (tafsir) => tafsir.ayat === ayatId,
        );
        if (tafsirAyat) {
          setTafsirData(tafsirAyat);
          setError(null);
        } else {
          throw new Error("Tafsir untuk ayat ini tidak ditemukan.");
        }
      } else {
        throw new Error(data.message || "Gagal mengambil tafsir.");
      }
    } catch (err) {
      console.error("Error fetching tafsir:", err);
      setError("Terjadi kesalahan saat mengambil tafsir.");
    } finally {
      setLoading(false);
    }
  };

  return { tafsirData, loading, error, fetchTafsir };
};
