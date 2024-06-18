import { IPublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";

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

export function SignOutButton() {
  const { instance } = useMsal();
  return (
    <button onClick={() => signOutClickHandler(instance)}>Sign Out</button>
  );
}
