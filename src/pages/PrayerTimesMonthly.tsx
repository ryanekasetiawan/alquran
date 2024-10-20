import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import {
  fetchPrayerTimesForMonth,
  PrayerTime,
} from "@/hooks/useFetchPrayerTimes";

const cleanPrayerTime = (time: string): string => {
  return time.split(" ")[0];
};

const PrayerTimesMonthly = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<React.ReactNode>(null);
  const [locationAllowed, setLocationAllowed] = useState<boolean>(true);
  const [monthName, setMonthName] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const getMonthName = (month: number): string => {
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return monthNames[month - 1];
  };

  useEffect(() => {
    const fetchData = async (latitude: number, longitude: number) => {
      try {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const timings = await fetchPrayerTimesForMonth(
          latitude,
          longitude,
          month,
          year,
        );

        if (timings) {
          setPrayerTimes(timings);
        } else {
          setError("Failed to fetch prayer times for the month.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        setError("An error occurred while fetching prayer times.");
        setLoading(false);
      }
    };

    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setMonthName(getMonthName(new Date().getMonth() + 1));
          setYear(new Date().getFullYear());

          fetchData(latitude, longitude);
          setLocationAllowed(true);
        },
        (geoError) => {
          console.error("Error getting location:", geoError);
          setError(
            <div className="mt-2 md:mt-5 min-h-[100vh] mx-5 md:mx-12">
              Unable to get location, using default location (Jakarta).
            </div>,
          );
          setLocationAllowed(false);

          const defaultLatitude = -6.2088;
          const defaultLongitude = 106.8456;

          fetchData(defaultLatitude, defaultLongitude);
        },
      );
    };

    getLocation();
  }, []);

  const isToday = (dateString: string) => {
    const today = new Date();
    const [day, month, year] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!prayerTimes.length) {
    return <div>No prayer times available for this month.</div>;
  }

  return (
    <div className="mt-2 md:mt-5 min-h-[100vh] mx-5 md:mx-12">
      <h2 className="text-xl font-bold mb-4">
        {locationAllowed
          ? `Jadwal Salat Bulan ${monthName} ${year} untuk Wilayah Anda`
          : `Jadwal Salat Bulan ${monthName} ${year} untuk Wilayah Jakarta`}
      </h2>
      <div className="overflow-x-auto">
        <div className="max-h-[80vh] overflow-y-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="sticky -top-0.5 bg-[#3daa25] z-10">
              <tr className="text-white font-semibold">
                <th className="border px-4 py-2">Tanggal</th>
                <th className="border px-4 py-2">Imsak</th>
                <th className="border px-4 py-2">Subuh</th>
                <th className="border px-4 py-2">Terbit</th>
                <th className="border px-4 py-2">Zuhur</th>
                <th className="border px-4 py-2">Ashar</th>
                <th className="border px-4 py-2">Maghrib</th>
                <th className="border px-4 py-2">Isya</th>
              </tr>
            </thead>
            <tbody>
              {prayerTimes.map((times, index) => {
                const date = String(times.date.gregorian.day).padStart(2, "0");
                return (
                  <tr
                    key={index}
                    className={`text-center ${
                      isToday(date) ? "bg-[#3daa25] text-white" : ""
                    }`}
                  >
                    <td className="border px-4 py-2">{date}</td>
                    <td className="border px-4 py-2">
                      {cleanPrayerTime(times.timings.Imsak)}
                    </td>
                    <td className="border px-4 py-2">
                      {cleanPrayerTime(times.timings.Fajr)}
                    </td>
                    <td className="border px-4 py-2">
                      {cleanPrayerTime(times.timings.Sunrise)}
                    </td>
                    <td className="border px-4 py-2">
                      {cleanPrayerTime(times.timings.Dhuhr)}
                    </td>
                    <td className="border px-4 py-2">
                      {cleanPrayerTime(times.timings.Asr)}
                    </td>
                    <td className="border px-4 py-2">
                      {cleanPrayerTime(times.timings.Maghrib)}
                    </td>
                    <td className="border px-4 py-2">
                      {cleanPrayerTime(times.timings.Isha)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesMonthly;
