import { useMsal } from "@azure/msal-react";
import { useAzureOauth } from "../hooks/useAzureOauth";
import { MailListing } from "./MailListing";
import { SignOutButton } from "./SignOut";
import { useStore } from "../utils/store";
import { useEffect } from "react";
import { socket } from "../utils/socket";
import { isEmpty } from "lodash";

export type EventMail = {
  id: string;
  subject: string;
  bodyPreview: string;
  receivedDateTime: string;
  from: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  isRead: string;
  isDraft: string;
  flag: {
    flagStatus: "flagged" | "notFlagged";
  };
  changeType: "created" | "updated" | "deleted";
  mailFolderId: string;
};

export function ProtectedComponent() {
  const { accounts } = useMsal();
  const { isPending } = useAzureOauth();
  const mails = useStore((state) => state.mails);
  const mailFolders = useStore((state) => state.mailFolders);
  const addMail = useStore((state) => state.addMail);
  const updateMail = useStore((state) => state.updateMail);
  const deleteMail = useStore((state) => state.deleteMail);

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
    socket.emit("register", accounts?.[0]?.username);
    return () => {
      socket.off("register");
    };
  }, []);

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
      {!isEmpty(mails) ? (
        <MailListing mails={mails} mailFolders={mailFolders} />
      ) : null}
      <SignOutButton />
    </div>
  );
}
