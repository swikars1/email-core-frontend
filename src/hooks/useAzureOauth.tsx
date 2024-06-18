import {
  InteractionStatus,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { createUser } from "../services";

export function useAzureOauth() {
  const { instance, inProgress, accounts } = useMsal();

  const { mutate: createUserMutate, isPending } = useMutation({
    mutationFn: createUser,
    mutationKey: ["create-user"],
    onSuccess: () => {
      console.log("user created");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    const accessTokenRequest = {
      scopes: ["user.read", "mail.send", "mail.readwrite"],
      account: accounts?.[0],
    };

    if (inProgress === InteractionStatus.None) {
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then(async (res) => {
          createUserMutate({
            emailAddress: res.account.username,
            accountId: res.account.localAccountId,
            accessToken: res.accessToken,
          });
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect(accessTokenRequest);
          }
          console.log(error);
        });
    }
  }, [instance, accounts, inProgress]);

  return { isPending: inProgress !== InteractionStatus.None || isPending };
}
