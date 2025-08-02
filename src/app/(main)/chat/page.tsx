"use client";
import { Chat } from "@/components/chat/Chat";
import Header from "@/components/layout/header/header";
import React, { Suspense } from "react";

const ChatPage = () => {
  return (
    <div className="w-full">
      <Header />
      <Suspense fallback={<div>Loading Chats</div>}>
        <Chat />
      </Suspense>
    </div>
  );
};

export default ChatPage;
