"use client";

import React, { useState } from "react";
import { MessageCircle, Loader2, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { getConversations } from "@/lib/actions/conversation.action";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Conversation {
  _id: string;
  type: string;
  name: string;
  description: string;
  participants: Array<{
    user: {
      _id: string;
      name: string;
      username: string;
      profilePicture?: string;
      isVerified?: boolean;
    };
    isActive: boolean;
    unreadCount: number;
  }>;
  lastMessage?: {
    content: string;
    sender: {
      _id: string;
      name: string;
      username: string;
      profilePicture?: string;
    };
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

const ConversationDropdown = () => {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ["conversations", "dropdown"],
    queryFn: async () =>
      await getConversations({
        token: session?.session.token as string,
        type: "direct",
        limit: 8,
        page: 1,
      }),
    enabled: !!session?.session.token && isOpen,
  });

  const conversations = conversationsData?.conversations || [];
  const totalUnread = conversations.reduce((sum: number, conv: Conversation) => sum + (conv.unreadCount || 0), 0);

  const getConversationName = (conversation: Conversation) => {
    if (conversation.type === "direct" && conversation.participants.length === 2) {
      const otherParticipant = conversation.participants.find(
        (p) => p.user._id !== session?.user.id
      );
      return otherParticipant && otherParticipant.user.name 
        ? otherParticipant.user.name 
        : conversation.name;
    }
    return conversation.name;
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === "direct" && conversation.participants.length === 2) {
      const otherParticipant = conversation.participants.find(
        (p) => p.user._id !== session?.user.id
      );
      return otherParticipant?.user.profilePicture;
    }
    return undefined;
  };

  const getConversationFallback = (conversation: Conversation) => {
    if (conversation.type === "direct" && conversation.participants.length === 2) {
      const otherParticipant = conversation.participants.find(
        (p) => p.user._id !== session?.user.id
      );
      return otherParticipant && otherParticipant.user.name 
        ? otherParticipant.user.name[0] 
        : (conversation.name ? conversation.name[0] : '?');
    }
    return conversation.name ? conversation.name[0] : '?';
  };

  const getConversationIcon = (conversation: Conversation) => {
    if (conversation.type === "group") {
      return <Users className="w-4 h-4 text-blue-500" />;
    }
    return <User className="w-4 h-4 text-green-500" />;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <MessageCircle className="h-5 w-5 text-white" />
          {totalUnread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {totalUnread > 99 ? "99+" : totalUnread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-semibold">Messages</span>
          <Link href="/chat" className="text-xs text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="ml-2 text-sm text-gray-500">Loading conversations...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <MessageCircle className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No conversations yet</p>
            <p className="text-xs text-gray-400">Start a conversation with someone</p>
          </div>
        ) : (
          conversations.map((conversation: Conversation) => (
            <DropdownMenuItem
              key={conversation._id}
              asChild
              className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50"
            >
              <Link href={`/chat?conversationId=${conversation._id}`} onClick={() => setIsOpen(false)}>
                <div className="flex-shrink-0 relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={getConversationAvatar(conversation)} />
                    <AvatarFallback>
                      {getConversationFallback(conversation)}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                      {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                    </Badge>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getConversationName(conversation)}
                        </p>
                        {getConversationIcon(conversation)}
                      </div>
                      
                                             {conversation.lastMessage ? (
                         <div className="mt-1">
                           <p className="text-xs text-gray-500 truncate">
                                                           <span className="font-medium">
                                {conversation.lastMessage.sender._id === session?.user.id ? "You" : `${conversation.lastMessage.sender.name || 'Unknown'}`}:
                              </span>{" "}
                             {typeof conversation.lastMessage.content === 'string' 
                               ? conversation.lastMessage.content 
                               : 'Media message'}
                           </p>
                           <p className="text-xs text-gray-400 mt-1">
                             {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                           </p>
                         </div>
                       ) : (
                         <p className="text-xs text-gray-400 mt-1">No messages yet</p>
                       )}
                    </div>
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        )}
        
        {conversations.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/chat" className="text-center text-sm text-blue-600 hover:text-blue-700">
                Start new conversation
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationDropdown;
