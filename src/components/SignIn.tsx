import { IPublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";

function signInClickHandler(instance: IPublicClientApplication) {
  instance.loginRedirect();
}

export function SignInButton() {
  const { instance } = useMsal();
  return <button onClick={() => signInClickHandler(instance)}>Sign In</button>;
}
