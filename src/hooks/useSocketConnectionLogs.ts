import { useEffect } from "react";
import { useStore } from "../utils/store";
import { socket } from "../utils/socket";

export const useSocketConnectionLogs = () => {
  const setSocketed = useStore((state) => state.setSocketed);

  useEffect(() => {
    function onConnect() {
      setSocketed(true);
    }

    function onDisconnect() {
      setSocketed(false);
    }

    function onConnectError(error: any) {
      if (socket.active) {
        console.log(error.message, "active");
      } else {
        console.log(error.message, "inactive");
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, []);
};
