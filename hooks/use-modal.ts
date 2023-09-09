import { create } from "zustand";

export type modalType = "CREATE_SERVER";

interface ModalProps {
  type: modalType | null;
  isOpen: boolean;
  onOpen: (type: modalType) => void;
  onClose: () => void;
}

export const useModal = create<ModalProps>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) =>
    set({
      type,
      isOpen: true,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
    }),
}));
