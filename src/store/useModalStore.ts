import { create } from "zustand";

type ModalStore = {
  isOpen: boolean;
  id?: string;
  openModal: (id: string) => void;
  closeModal: () => void;
};

const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  id: undefined,

  openModal: (id) => set({ isOpen: true, id }),
  closeModal: () => set({ isOpen: false, id: undefined }),
}));

export default useModalStore;
