import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type modalType =
  | "CREATE_SERVER"
  | "INVITE"
  | "EDIT_SERVER"
  | "MEMBER_MANAGEMENT"
  | "CREATE_CHANNEL"
  | "EDIT_CHANNEL"
  | "DELETE_CHANNEL"
  | "LEAVE_MODAL"
  | "EDIT_CHANNEL"
  | "FILE_UPLOAD"
  | "DELETE_MESSAGE";

interface UserModalDataProp {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string; 
  query?: Record<string, any>
}

interface ModalProps {
  type: modalType | null;
  data: UserModalDataProp;
  isOpen: boolean;
  onOpen: (
    type: modalType,
    data?: UserModalDataProp,
    channelType?: ChannelType
  ) => void;
  onClose: () => void;
  channelType?: ChannelType;
}

export const useModal = create<ModalProps>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}, channelType = "TEXT") => {
    return set({
      type,
      isOpen: true,
      data,
      channelType,
    });
  },
  onClose: () =>
    set({
      data: {},
      type: null,
      isOpen: false,
      channelType: "TEXT",
    }),
}));
