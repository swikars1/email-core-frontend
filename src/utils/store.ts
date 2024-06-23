import { create } from "zustand";
import { socket } from "./socket";

export type TMail = {
  id: string;
  isRead: string;
  isDraft: string;
  subject: string;
  bodyPreview: string;
  sender: {
    name: string;
    email: string;
  };
};
type Store = {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  mails: TMail[];
  setAllMails: (mails: TMail[]) => void;
  addMail: (mail: TMail) => void;
  updateMail: (mail: TMail) => void;
  socketed: boolean;
  setSocketed: (val: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  accessToken: "",
  setAccessToken: (accessToken) => set(() => ({ accessToken: accessToken })),
  mails: [],
  setAllMails: (mails) => set(() => ({ mails: mails })),
  addMail: (mail) => set((state) => ({ mails: [mail, ...state.mails] })),
  updateMail: (mail) =>
    set((state) => {
      return {
        mails: state.mails.map((m) => (m.id === mail.id ? mail : m)),
      };
    }),
  socketed: socket.connected,
  setSocketed: (val) => set(() => ({ socketed: val })),
}));
