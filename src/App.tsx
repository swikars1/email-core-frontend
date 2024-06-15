import {
  IPublicClientApplication,
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import {
  useMsal,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { useEffect, useState } from "react";

interface EmailAddress {
  name: string;
  address: string;
}

interface SenderRecipient {
  emailAddress: EmailAddress;
}

interface BodyContent {
  contentType: string;
  content: string;
}

interface Flag {
  flagStatus: string;
}

interface Email {
  "@odata.etag": string;
  id: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  changeKey: string;
  categories: string[];
  receivedDateTime: string;
  sentDateTime: string;
  hasAttachments: boolean;
  internetMessageId: string;
  subject: string;
  bodyPreview: string;
  importance: string;
  parentFolderId: string;
  conversationId: string;
  conversationIndex: string;
  isDeliveryReceiptRequested: boolean | null;
  isReadReceiptRequested: boolean;
  isRead: boolean;
  isDraft: boolean;
  webLink: string;
  inferenceClassification: string;
  body: BodyContent;
  sender: SenderRecipient;
  from: SenderRecipient;
  toRecipients: SenderRecipient[];
  ccRecipients: SenderRecipient[];
  bccRecipients: SenderRecipient[];
  replyTo: SenderRecipient[];
  flag: Flag;
}

interface ImportantEmailData {
  id: string;
  subject: string;
  fromName: string;
  fromAddress: string;
  receivedDateTime: string;
  bodyPreview: string;
  isRead: boolean;
}

async function outlookGraphAPI(accessToken: string, urlPart: string) {
  var headers = new Headers();
  var bearer = "Bearer " + accessToken;
  headers.append("Authorization", bearer);
  var options = {
    method: "GET",
    headers: headers,
  };
  var graphEndpoint = `https://graph.microsoft.com/v1.0/me/${urlPart}`;

  const fetchData = await fetch(graphEndpoint, options);
  const fetchJsonData = await fetchData.json();
  return fetchJsonData;
}

function extractImportantEmailData(emails: Email[]) {
  return emails.map((email) => {
    return {
      id: email.id,
      subject: email.subject,
      fromName: email.from.emailAddress.name,
      fromAddress: email.from.emailAddress.address,
      receivedDateTime: email.receivedDateTime,
      bodyPreview: email.bodyPreview,
      isRead: email.isRead,
    };
  });
}
function ProtectedComponent() {
  const { instance, inProgress, accounts } = useMsal();
  const [mailMessages, setMailMessages] = useState<ImportantEmailData[]>([]);

  console.log({ mailMessages });

  useEffect(() => {
    const accessTokenRequest = {
      scopes: ["user.read", "mail.send", "mail.readwrite"],
      account: accounts?.[0],
    };

    if (!mailMessages?.length && inProgress === InteractionStatus.None) {
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then(async (accessTokenResponse) => {
          const authData = {
            accessToken: accessTokenResponse.accessToken,
          };

          const messages = await outlookGraphAPI(
            authData.accessToken,
            "messages"
          );

          const impData = extractImportantEmailData(messages.value);

          setMailMessages(impData);
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect(accessTokenRequest);
          }
          console.log(error);
        });
    }
  }, [instance, accounts, inProgress, mailMessages]);

  return (
    <div>
      <EmailTable mailMessages={mailMessages} />
    </div>
  );
}

function EmailTable({ mailMessages }: { mailMessages: ImportantEmailData[] }) {
  return (
    <div className="shadow bg-white rounded-lg overflow-hidden">
      <table className="w-full text-left table-collapse">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3">Subject</th>
            <th className="p-3">From Name</th>
            <th className="p-3">From Address</th>
            <th className="p-3">Received DateTime</th>
            <th className="p-3">Body Preview</th>
            <th className="p-3">Is Read</th>
          </tr>
        </thead>
        <tbody>
          {mailMessages.map((message) => (
            <tr key={message.id} className="border-b border-gray-200">
              <td className="p-3">{message.subject}</td>
              <td className="p-3">{message.fromName}</td>
              <td className="p-3">{message.fromAddress}</td>
              <td className="p-3">{message.receivedDateTime}</td>
              <td className="p-3">{message.bodyPreview}</td>
              <td className="p-3">{message.isRead.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function signInClickHandler(instance: IPublicClientApplication) {
  instance.loginRedirect();
}

function signOutClickHandler(instance: IPublicClientApplication) {
  const logoutRequest = {
    account: instance.getAccountByHomeId(
      "62802fc4-a53d-46b7-877f-27ead706faa2"
    ),
    mainWindowRedirectUri: "http://localhost:5173/",
    postLogoutRedirectUri: "http://localhost:5173/",
  };
  instance.logoutPopup(logoutRequest);
}

// SignInButton Component returns a button that invokes a popup sign in when clicked
function SignInButton() {
  // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
  const { instance } = useMsal();

  return <button onClick={() => signInClickHandler(instance)}>Sign In</button>;
}

// SignOutButton component returns a button that invokes a pop-up sign out when clicked
function SignOutButton() {
  // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
  const { instance } = useMsal();

  return (
    <button onClick={() => signOutClickHandler(instance)}>Sign Out</button>
  );
}

function WelcomeUser() {
  const { accounts } = useMsal();
  const username = accounts[0].username;

  return <p>Welcome, {username}</p>;
}

// Remember that MsalProvider must be rendered somewhere higher up in the component tree
export default function App() {
  return (
    <>
      <AuthenticatedTemplate>
        <p>This will only render if a user is signed-in.</p>
        <WelcomeUser />
        <ProtectedComponent />
        <SignOutButton />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>This will only render if a user is not signed-in.</p>
        <SignInButton />
      </UnauthenticatedTemplate>
    </>
  );
}
