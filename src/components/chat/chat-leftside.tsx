/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Input } from "../ui/input";
import { ContactItem } from "./contact-item";
import { SearchIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/lib/actions/conversation.action";
import AddChatDialog from "./add-chat-dialog";
import { useQueryState } from "nuqs";

const ChatLeftside = () => {
  const { data: session } = authClient.useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [conversationId, setConversationId] = useQueryState("conversationId");

  const { data } = useQuery({
    queryKey: ["get-conversations"],
    queryFn: async () => {
      return await getConversations({
        token: session?.session.token as string,
      });
    },
    enabled: !!session?.session.token,
  });

  const conversations = data?.conversations;
  console.log("Conversations: ", conversations);

  return (
    <div className="w-96 border-r border-gray-200 flex flex-col">
      {/* Messages Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
      </div>

      {/* Search and New Chat */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-1">
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <AddChatDialog />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {conversations &&
          conversations.length > 0 &&
          conversations.map((conversation: any) => {
            const contact = conversation.participants.find(
              (member: any) => member.user._id !== session?.user.id
            );
            return (
              <ContactItem
                key={contact.user._id}
                contact={{
                  lastMessage: conversation.lastMessage,
                  AvatarImage: contact.user.profilePicture,
                  name: contact.user.name,
                  id: contact.user_id,
                }}
                isActive={conversationId === conversation._id}
                onClick={() => setConversationId(conversation._id)}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ChatLeftside;
