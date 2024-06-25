import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  import.meta.env.MODE === "production" ? undefined : "http://localhost:3000";

export const socket = io(URL!, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  auth: (cb) => {
    cb({
      token: sessionStorage.getItem("jwtToken") || "",
    });
  },
});
