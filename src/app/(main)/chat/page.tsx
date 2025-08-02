"use client";
import { Chat } from "@/components/chat/Chat";
import Header from "@/components/layout/header/header";
import React from "react";

const ChatPage = () => {
  return (
    <div className="w-full">
      <Header />
      <Chat />
    </div>
  );
};

export default ChatPage;
