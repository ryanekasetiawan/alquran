import { MouseEvent } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
};

const Modal = ({ isOpen, onClose, message }: ModalProps) => {
  if (!isOpen) return null;

  const handleClickOutside = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "modal-wrapper") {
      onClose();
    }
  };

  return (
    <div
      id="modal-wrapper"
      onClick={handleClickOutside}
      className="fixed z-[9999] inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">Peringatan</h2>
        <p>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default Modal;
