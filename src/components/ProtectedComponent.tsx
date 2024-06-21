import { useMsal } from "@azure/msal-react";
import { useAzureOauth } from "../hooks/useAzureOauth";
import { MailListing } from "./MailListing";
import { SignOutButton } from "./SignOut";
import { useStore } from "../utils/store";
import { useEffect } from "react";
import { socket } from "../utils/socket";

export function ProtectedComponent() {
  const { accounts } = useMsal();
  const { isPending } = useAzureOauth();
  const mails = useStore((state) => state.mails);
  const setSocketed = useStore((state) => state.setSocketed);
  const socketed = useStore((state) => state.socketed);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

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

  useEffect(() => {
    socket.on("newmail", (payload: any) => {
      console.log("mail arrived", payload);
    });

    return () => {
      socket.off("newmail");
    };
  }, []);

  return (
    <div className="flex justify-center flex-col m-4">
      {/* <ConnectionManager /> */}
      <div className="text-2xl text-center mb-6">
        {isPending
          ? "Loading your mails..."
          : `Welcome, ${accounts?.[0]?.username}, you are ${
              socketed ? "connected." : "not connected."
            } `}
      </div>
      {mails?.length > 0 ? <MailListing mails={mails} /> : null}
      <SignOutButton />
    </div>
  );
}
