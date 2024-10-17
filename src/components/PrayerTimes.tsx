import { useState, useEffect } from "react";
import { fetchPrayerTimes, PrayerTimesType } from "@/hooks/useFetchPrayerTimes";

const usePrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [locationAllowed, setLocationAllowed] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrayerTimesWithLocation = async () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const timings = await fetchPrayerTimes(latitude, longitude);
          if (timings) {
            setPrayerTimes(timings);
          } else {
            setError("Failed to fetch prayer times.");
          }
          setLoading(false);
        },
        async (geoError) => {
          console.error("Error getting location:", geoError);
          setError("Unable to get location, using default location (Jakarta).");
          setLocationAllowed(false);

          const defaultLatitude = -6.2088;
          const defaultLongitude = 106.8456;
          const timings = await fetchPrayerTimes(
            defaultLatitude,
            defaultLongitude,
          );

          if (timings) {
            setPrayerTimes(timings);
          } else {
            setError("Failed to fetch prayer times.");
          }

          setLoading(false);
        },
      );
    };

    fetchPrayerTimesWithLocation();
  }, []);

  return { prayerTimes, loading, error, locationAllowed };
};

const PrayerTimes = () => {
  const { prayerTimes, loading, error, locationAllowed } = usePrayerTimes();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!prayerTimes) {
    return <div>Failed to load prayer times.</div>;
  }

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-2">
        {locationAllowed
          ? "Waktu Salat Wilayah Anda"
          : "Waktu Salat Wilayah Jakarta"}
      </h2>
      <ul className="space-y-1">
        <li>
          <span className="font-semibold">Imsak:</span> {prayerTimes.Imsak}
        </li>
        <li>
          <span className="font-semibold">Subuh:</span> {prayerTimes.Fajr}
        </li>
        <li>
          <span className="font-semibold">Terbit:</span> {prayerTimes.Sunrise}
        </li>
        <li>
          <span className="font-semibold">Zuhur:</span> {prayerTimes.Dhuhr}
        </li>
        <li>
          <span className="font-semibold">Ashar:</span> {prayerTimes.Asr}
        </li>
        <li>
          <span className="font-semibold">Maghrib:</span> {prayerTimes.Maghrib}
        </li>
        <li>
          <span className="font-semibold">Isya:</span> {prayerTimes.Isha}
        </li>
      </ul>
    </div>
  );
};

export default PrayerTimes;
