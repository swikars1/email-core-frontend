import { useMsal } from "@azure/msal-react";
import { useAzureOauth } from "../hooks/useAzureOauth";
import { MailListing } from "./MailListing";
import { SignOutButton } from "./SignOut";
import { useStore } from "../utils/store";
import { useEffect } from "react";
import { socket } from "../utils/socket";

type EventMail = {
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
  importance: string;
  changeType: "created" | "updated";
};

export function ProtectedComponent() {
  const { accounts } = useMsal();
  const { isPending } = useAzureOauth();
  const mails = useStore((state) => state.mails);
  const addMail = useStore((state) => state.addMail);
  const updateMail = useStore((state) => state.updateMail);

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
    socket.on(`newmail-${accounts?.[0]?.username}`, (payload: EventMail) => {
      const mailData = {
        id: payload.id,
        isRead: payload.isRead,
        isDraft: payload.isDraft,
        subject: payload.subject,
        bodyPreview: payload.bodyPreview,
        sender: {
          name: payload.from.emailAddress.name,
          email: payload.from.emailAddress.address,
        },
      };
      if (payload.changeType === "created") {
        addMail(mailData);
      }
      if (payload.changeType === "updated") {
        updateMail(mailData);
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
      <ul>
        <li>- emit socket events only to spefic client</li>
        <li>- inbox folder management</li>
        <li>
          - frontend sync for moved emails, read/unread status, flags,
          deletions, new emails
        </li>
        <li>- add only required mails fields to db</li>
        <li>- update db after socket call</li>
        <li>- authentication for socket calls</li>
        <li>- code refactor and push to github, fix git user</li>
        <li>- automatic elastic api key and key id in env</li>
        <li>- add a process to update ngrok url in env</li>
        <li>- write proper documentation for running it initially</li>
        <li>- send for testing to friends</li>
        <li>- refresh oauth token</li>
        <li>- renew subscriptions</li>
        <li>- manage local expired subscriptions</li>
        <li>- create new subscriptions while login if old is expired</li>
        <li>- pagination for mails</li>
      </ul>
      {mails?.length > 0 ? <MailListing mails={mails} /> : null}
      <SignOutButton />
    </div>
  );
}
