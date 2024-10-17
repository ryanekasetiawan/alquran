export type PrayerTimesType = {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

export type PrayerTime = {
  date: {
    gregorian: {
      day: number;
      month: number;
      year: number;
    };
  };
  timings: PrayerTimesType;
};

export const fetchPrayerTimes = async (
  latitude: number,
  longitude: number,
): Promise<PrayerTimesType | null> => {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=20&tune=2.5,2.5,-1.1,2.282,1.6,2.13,0,2.1,0`,
    );
    const data = await response.json();
    return data?.data?.timings || null;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return null;
  }
};

export const fetchPrayerTimesForMonth = async (
  latitude: number,
  longitude: number,
  month: number,
  year: number,
): Promise<PrayerTime[]> => {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=20&month=${month}&year=${year}&tune=2.5,2.5,-1.1,2.282,1.6,2.13,0,2.1,0`,
    );
    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return [];
  }
};
