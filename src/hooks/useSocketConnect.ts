import { useEffect } from "react";
import { socket } from "../utils/socket";

export const useSocketConnect = () => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
};
