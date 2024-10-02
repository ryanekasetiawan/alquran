// src/api.ts
export type Doa = {
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

export const useFetchDoa = async (): Promise<Doa[]> => {
  try {
    const response = await fetch("https://equran.id/api/doa");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
