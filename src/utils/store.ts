import { create } from "zustand";
import { socket } from "./socket";
import { immer } from "zustand/middleware/immer";
import { EventMail } from "../components/ProtectedComponent";

export type TMail = {
  id: string;
  isRead: string;
  isDraft: string;
  subject: string;
  bodyPreview: string;
  from: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  flag: {
    flagStatus: "flagged" | "notFlagged";
  };
  mailFolderId: string;
};
export type TMailFolder = {
  id: string;
  displayName: string;
  parentFolderId?: string;
  childFolderCount: number;
  unreadItemCount: number;
  totalItemCount: number;
  sizeInBytes: number;
  isHidden: boolean;
};

type Store = {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  mails: Record<string, TMail[]>;
  setMails: (mails: Record<string, TMail[]>) => void;
  mailFolders: TMailFolder[];
  setMailFolders: (mailfolders: TMailFolder[]) => void;
  addMail: (mail: EventMail) => void;
  updateMail: (mail: TMail) => void;
  deleteMail: (mail: TMail) => void;

  socketed: boolean;
  setSocketed: (val: boolean) => void;
};

export const useStore = create<Store>()(
  immer((set) => ({
    accessToken: "",
    setAccessToken: (accessToken) => set(() => ({ accessToken: accessToken })),
    mails: {},
    setMails: (mails) => set(() => ({ mails: mails })),
    addMail: (mail) =>
      set((state) => {
        state.mails[mail.mailFolderId].unshift(mail);
      }),
    updateMail: (mail) =>
      set((state) => {
        const index = state.mails[mail.mailFolderId].findIndex(
          (el) => el.id === mail.id
        );
        if (index > -1) {
          state.mails[mail.mailFolderId][index] = mail;
        }
      }),
    deleteMail: (mail) =>
      set((state) => {
        const index = state.mails[mail.mailFolderId].findIndex(
          (el) => el.id === mail.id
        );
        if (index > -1) {
          state.mails[mail.mailFolderId].splice(index, 1);
        }
      }),
    mailFolders: [],
    setMailFolders: (mailFolders) => set(() => ({ mailFolders: mailFolders })),
    socketed: socket.connected,
    setSocketed: (val) => set(() => ({ socketed: val })),
  }))
);
