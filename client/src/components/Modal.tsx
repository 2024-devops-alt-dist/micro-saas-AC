import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  isClose: () => void;
  content: React.ReactNode;
}

const ModalOverlay: React.FC<ModalProps> = ({ isOpen, isClose, content }: ModalProps) => {
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ferme la modal si on clique sur l'arrière-plan
    const target = e.target as HTMLElement;
    if (target.classList.contains("modalBack")) {
      isClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modalBack" onClick={handleModalClick}>
      <div className=" p-6 rounded-lg shadow-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        {content}
        <div className="absolute top-2 right-2 cursor-pointer text-xl hover:text-gray-600" onClick={isClose}>
          ✖️
        </div>
      </div>
    </div>
  );
};

const Modal: React.FC<ModalProps> = ({ isOpen, isClose, content }: ModalProps) => {
  return (
    <>
      {ReactDOM.createPortal(
        <ModalOverlay isOpen={isOpen} isClose={isClose} content={content} />,
        document.getElementById("modal-root")!
      )}
    </>
  );
};

export default Modal;