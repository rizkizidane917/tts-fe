import { useEffect, useRef } from "react";
import useModalStore from "@/store/useModalStore";

type ModalProps = {
  id: string;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ id, children }) => {
  const { isOpen, id: activeId, closeModal } = useModalStore();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const show = isOpen && activeId === id;

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeModal]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, closeModal]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
      >
        <div className="w-full h-full">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
