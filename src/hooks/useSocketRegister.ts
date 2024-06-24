import { useEffect } from "react";
import { socket } from "../utils/socket";
import { useMsal } from "@azure/msal-react";

export const useSocketRegister = () => {
  const { accounts } = useMsal();

  useEffect(() => {
    socket.emit("register", accounts?.[0]?.username);
    return () => {
      socket.off("register");
    };
  }, []);
};
