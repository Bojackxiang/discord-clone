import { Channel, Server } from "@prisma/client";
import { create } from "zustand";

export type modalType =
  | "CREATE_SERVER"
  | "INVITE"
  | "EDIT_SERVER"
  | "MEMBER_MANAGEMENT"
  | "CREATE_CHANNEL"
  | "EDIT_CHANNEL"
  | "DELETE_CHANNEL"
  | "LEAVE_MODAL";

interface UserModalDataProp {
  server?: Server;
  channel?: Channel;
}

interface ModalProps {
  type: modalType | null;
  data: UserModalDataProp;
  isOpen: boolean;
  onOpen: (type: modalType, data?: UserModalDataProp) => void;
  onClose: () => void;
}

export const useModal = create<ModalProps>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) =>
    set({
      type,
      isOpen: true,
      data,
    }),
  onClose: () =>
    set({
      data: {},
      type: null,
      isOpen: false,
    }),
}));
