import { IPublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";

function signInClickHandler(instance: IPublicClientApplication) {
  instance.loginRedirect();
}

export function SignInComponent() {
  const { instance } = useMsal();
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome!</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue.
          </p>
        </div>
        <button
          onClick={() => signInClickHandler(instance)}
          className="w-full border-2 border-solid rounded-lg px-4 py-2"
        >
          <span>Login with Microsoft</span>
        </button>
      </div>
    </div>
  );
}
