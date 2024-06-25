import { useMsal } from "@azure/msal-react";
import { useAzureOauth } from "../hooks/useAzureOauth";
import { MailListing } from "./MailListing";
import { SignOutButton } from "./SignOut";
import { useStore } from "../utils/store";
import { isEmpty } from "lodash";
import { useSocketConnect } from "../hooks/useSocketConnect";
import { useSocketConnectionLogs } from "../hooks/useSocketConnectionLogs";
import { useSocketRegister } from "../hooks/useSocketRegister";
import { useSocketMailEvent } from "../hooks/useSocketMailEvent";

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

  const socketed = useStore((state) => state.socketed);

  // socket useEffects hooks in order
  useSocketConnect();
  useSocketConnectionLogs();
  useSocketRegister();
  useSocketMailEvent();

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
