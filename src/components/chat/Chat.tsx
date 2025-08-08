import React from "react";
import ChatLeftside from "./chat-leftside";
import Chatarea from "./chat-area";
import { useQueryState } from "nuqs";
import ChatSheet from "./chat-sheet";

export const Chat: React.FC = () => {
  const [conversationId] = useQueryState("conversationId");

  return (
    <>
      <div className="h-[calc(100vh-64px)] bg-gray-50 w-full">
        <div className="md:hidden block ml-3">
          <ChatSheet />
        </div>
        <div className="flex h-full container mx-auto bg-white shadow-lg">
          <div className="max-md:hidden blcok">
            <ChatLeftside />
          </div>
          {conversationId && <Chatarea />}
        </div>
      </div>
    </>
  );
};
