import { useState, useEffect } from "react";

const HaditsDailyModal = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("hasSeenModal");

    if (!hasSeenModal) {
      setShowModal(true);
      sessionStorage.setItem("hasSeenModal", "true");
    }
  }, []);

  const closeModal = (): void => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          Selamat Datang di Website Kami!
        </h2>
        <p className="mb-4">
          Ini adalah popup yang hanya akan muncul sekali selama sesi ini.
        </p>
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

export default HaditsDailyModal;
