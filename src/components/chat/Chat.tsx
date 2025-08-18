import React, { useEffect } from "react";
import ChatLeftside from "./chat-leftside";
import Chatarea from "./chat-area";
import { useQueryState } from "nuqs";
import ChatSheet from "./chat-sheet";
import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/lib/actions/conversation.action";
import { authClient } from "@/lib/auth-client";

export const Chat: React.FC = () => {
  const { data } = authClient.useSession();
  const [conversationId, setConversationId] = useQueryState("conversationId");

  const { data: conversations } = useQuery({
    queryKey: ["get-conversations"],
    queryFn: async () =>
      await getConversations({
        token: data?.session.token as string,
      }),
    enabled: !!data?.session.token,
  });

  useEffect(() => {
    setConversationId(conversations?.conversations?.[0]?._id);
  }, [conversations?.conversations?.[0]?._id]);

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
