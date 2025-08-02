"use client";
import React from "react";
import initSocket from "@/lib/socket";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

interface Auth {
  token: string;
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { data } = authClient.useSession();

  useEffect(() => {
    const socket = initSocket({ token: data?.session.token as string });
    if (!data?.session.token) return;
    (socket.auth as Auth).token = data?.session.token as string; // ensure token is fresh
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected to socket server");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [data?.session.token]);

  return <>{children}</>;
};

export default MainLayout;
