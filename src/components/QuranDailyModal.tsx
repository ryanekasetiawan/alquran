import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchPrayerTimes, PrayerTimesType } from "@/hooks/useFetchPrayerTimes";

const QuranDailyModal = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [message, setMessage] = useState<JSX.Element | null>(null);
  // const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchedPrayerTimes = async (latitude: number, longitude: number) => {
      const timings = await fetchPrayerTimes(latitude, longitude);
      if (timings) {
        // setPrayerTimes(timings);
        checkPrayerTimes(timings);
      }
    };

    const getPrayerTimesAndCheck = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchedPrayerTimes(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    };

    const checkPrayerTimes = (timings: PrayerTimesType) => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const currentDay = currentTime.getDay();

      // const isAfterPrayerTime = (prayerTime: string): boolean => {
      //   const [prayerHour, prayerMinutes] = prayerTime.split(":").map(Number);
      //   return (
      //     currentHour > prayerHour ||
      //     (currentHour === prayerHour && currentMinutes >= prayerMinutes)
      //   );
      // };

      const [maghribHour, maghribMinutes] =
        timings.Maghrib.split(":").map(Number);
      const maghribTimeInMinutes = maghribHour * 60 + maghribMinutes;
      const currentTimeInMinutes = currentHour * 60 + currentMinutes;

      // Malam hari atau malam Jum'at
      if (
        currentTimeInMinutes >= maghribTimeInMinutes &&
        currentTimeInMinutes < 1440
      ) {
        if (currentDay === 4) {
          setMessage(
            <>
              Sudah masuk malam Jum'at, disarankan membaca
              <Link
                to="/quran/surat/al-mulk"
                className="text-blue-500 underline ml-1"
                onClick={closeModal}
              >
                Surat Al-Mulk
              </Link>
              dan
              <Link
                to="/quran/surat/al-kahf"
                className="text-blue-500 underline ml-1"
                onClick={closeModal}
              >
                Surat Al-Kahfi
              </Link>
              .
            </>,
          );
        } else {
          setMessage(
            <>
              Sudah masuk waktu malam hari, disarankan membaca
              <Link
                to="/quran/surat/al-mulk"
                className="text-blue-500 underline ml-1"
                onClick={closeModal}
              >
                Surat Al-Mulk
              </Link>
              .
            </>,
          );
        }
        setShowModal(true);
      }

      // Hari Jum'at
      if (currentDay === 5) {
        const oneHourBeforeMaghrib = maghribTimeInMinutes - 60;
        if (
          currentTimeInMinutes >= 0 &&
          currentTimeInMinutes <= oneHourBeforeMaghrib
        ) {
          setMessage(
            <>
              Sudah memasuki hari Jum'at, disarankan membaca
              <Link
                to="/quran/surat/al-kahf"
                className="text-blue-500 underline ml-1"
                onClick={closeModal}
              >
                Surat Al-Kahfi
              </Link>
              .
            </>,
          );
          setShowModal(true);
        }
      }
    };

    const hasSeenModal = sessionStorage.getItem("hasSeenModal");
    if (!hasSeenModal) {
      getPrayerTimesAndCheck();
      sessionStorage.setItem("hasSeenModal", "true");
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeModal = (): void => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4">Pengingat</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default QuranDailyModal;
