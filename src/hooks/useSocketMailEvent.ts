import { useEffect } from "react";
import { EventMail } from "../components/ProtectedComponent";
import { socket } from "../utils/socket";
import { useMsal } from "@azure/msal-react";
import { useStore } from "../utils/store";

export const useSocketMailEvent = () => {
  const { accounts } = useMsal();

  const addMail = useStore((state) => state.addMail);
  const updateMail = useStore((state) => state.updateMail);
  const deleteMail = useStore((state) => state.deleteMail);

  useEffect(() => {
    socket.on(`newmail-${accounts?.[0]?.username}`, (payload: EventMail) => {
      if (payload.changeType === "created") {
        addMail(payload);
      }
      if (payload.changeType === "updated") {
        updateMail(payload);
      }
      if (payload.changeType === "deleted") {
        deleteMail(payload);
      }
      console.log("mail arrived", payload);
    });

    return () => {
      socket.off(`newmail-${accounts?.[0]?.username}`);
    };
  }, []);
};
