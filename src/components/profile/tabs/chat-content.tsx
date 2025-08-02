/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConversations } from "@/lib/actions/conversation.action";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import MessageItem from "../message-item";

const ChatContent = () => {
  const { data: session, isPending: isUserPending } = authClient.useSession();
  const { data, isPending } = useQuery({
    queryKey: ["get-conversations"],
    queryFn: async () =>
      await getConversations({
        token: session?.session.token as string,
      }),
    enabled: !!session?.session.token,
  });

  const conversations = data?.conversations;

  if (isPending || isUserPending) {
    return (
      <div className="w-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {conversations && conversations.length > 0 ? (
        conversations.map((conversation: any) => {
          const contact = conversation.participants.find(
            (member: any) => member.user._id !== session?.user.id
          );
          return (
            <MessageItem
              key={conversation._id}
              conversationId={conversation._id}
              lastMessage={conversation.lastMessage.content.text}
              name={contact.user.name}
              profilePicture={contact.user.profilePicture}
              time={new Date(
                conversation.lastMessage.createdAt
              ).toLocaleString()}
            />
          );
        })
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-lg font-semibold">No Conversation Found</h3>
        </div>
      )}
    </div>
  );
};

export default ChatContent;
