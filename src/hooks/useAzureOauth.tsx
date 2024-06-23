import {
  InteractionStatus,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createUser } from "../services";
import { useStore } from "../utils/store";

export function useAzureOauth() {
  const { instance, inProgress, accounts } = useMsal();
  const [tokenAccquired, setTokenAccquired] = useState(false);

  const setAccessToken = useStore((state) => state.setAccessToken);
  const setMails = useStore((state) => state.setMails);
  const setMailFolders = useStore((state) => state.setMailFolders);

  const { mutate: createUserMutate, isPending } = useMutation({
    mutationFn: createUser,
    mutationKey: ["create-user"],
    onSuccess: (res) => {
      setMails(res.data.responseMails);
      setMailFolders(res.data.mailFolders);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    if (!accounts?.[0]) return;
    if (tokenAccquired) return;
    if (!instance) return;
    const accessTokenRequest = {
      scopes: [
        "user.read",
        "mail.send",
        "mail.readwrite",
        "Subscription.Read.All",
        "offline_access",
      ],
      account: accounts?.[0],
    };

    if (inProgress === InteractionStatus.None) {
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then(async (res) => {
          setTokenAccquired(true);
          createUserMutate({
            accessToken: res.accessToken,
          });
          setAccessToken(res.accessToken);
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
