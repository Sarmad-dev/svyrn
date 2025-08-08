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
import { MessageSquare } from "lucide-react";

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
    <div className="w-full h-full flex flex-col bg-white">
      {/* Search and New Chat */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-colors"
            />
            <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <AddChatDialog />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {conversations && conversations.length > 0 ? (
          <div className="space-y-1 p-2">
            {conversations.map((conversation: any) => {
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
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No conversations yet
            </h3>
            <p className="text-gray-500 text-sm">
              Start a new chat to begin messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLeftside;
