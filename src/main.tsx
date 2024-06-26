import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

const config = {
  auth: {
    clientId: "bedb999a-c882-4ad3-87ca-f9d99ddf45cf",
  },
};

const publicClientApplication = new PublicClientApplication(config);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MsalProvider instance={publicClientApplication}>
    <App />
  </MsalProvider>
);
