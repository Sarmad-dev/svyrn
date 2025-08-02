// utils/socket.js or lib/socket.js
import { io } from "socket.io-client";
import { config } from "./config";

const initSocket = ({ token }: { token: string }) => {
  const socket = io(config.apiUrl || "http://localhost:4000", {
    auth: {
      token: typeof window !== "undefined" ? token : undefined,
    },
    withCredentials: true,
    autoConnect: false, // control when to connect
  });

  // console.log("Socket initialized", socket);
  return socket;
};

export default initSocket;
