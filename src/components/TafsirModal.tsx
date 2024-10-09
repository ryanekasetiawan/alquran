import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";

type TafsirModalProps = {
  show: boolean;
  onClose: () => void;
  tafsirData: React.ReactNode;
  loading: boolean;
  error: string | null;
  ayatNumber: number | null;
};

const TafsirModal = ({
  show,
  onClose,
  tafsirData,
  loading,
  error,
  ayatNumber,
}: TafsirModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed z-[1000] inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div
        ref={modalRef}
        className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center text-center mb-4">
          <h2 className="text-xl font-bold">Tafsir Ayat ke-{ayatNumber}</h2>
          <button onClick={onClose}>
            <FaTimes size={20} className="hover:text-red-500" />
          </button>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-screen h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-500"></div>
            <p>Loading tafsir...</p>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <p>{tafsirData}</p>
            <button
              onClick={onClose}
              className="mt-4 bg-red-500 text-white p-2 rounded"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TafsirModal;
