import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignInComponent } from "./components/SignIn";
import { ProtectedComponent } from "./components/ProtectedComponent";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthenticatedTemplate>
          <ProtectedComponent />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <SignInComponent />
        </UnauthenticatedTemplate>
      </QueryClientProvider>
    </>
  );
}
