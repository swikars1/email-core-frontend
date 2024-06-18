import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignOutButton } from "./components/SignOut";
import { SignInButton } from "./components/SignIn";
import { WelcomeUser } from "./components/WelcomeUser";
import { useAzureOauth } from "./hooks/useAzureOauth";

function ProtectedComponent() {
  const { isPending } = useAzureOauth();

  return <div>{isPending ? "Signing in..." : "Signed in Successfully!"}</div>;
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthenticatedTemplate>
          <p>You are logged in.</p>
          <WelcomeUser />
          <ProtectedComponent />
          <SignOutButton />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <p>You are not logged in.</p>
          <SignInButton />
        </UnauthenticatedTemplate>
      </QueryClientProvider>
    </>
  );
}
