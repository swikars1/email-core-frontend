import { create } from "zustand";
import { socket } from "./socket";

type Store = {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  mails: [];
  setAllMails: (mails: []) => void;
  socketed: boolean;
  setSocketed: (val: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  accessToken: "",
  setAccessToken: (accessToken) => set(() => ({ accessToken: accessToken })),
  mails: [],
  setAllMails: (mails) => set(() => ({ mails: mails })),
  socketed: socket.connected,
  setSocketed: (val) => set(() => ({ socketed: val })),
}));
