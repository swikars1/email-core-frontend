import { useMsal } from "@azure/msal-react";

export function WelcomeUser() {
  const { accounts } = useMsal();
  const username = accounts[0].username;

  return <p>Welcome, {username}</p>;
}
