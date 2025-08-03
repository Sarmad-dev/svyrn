/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { authClient } from "@/lib/auth-client";
import { useQueryState } from "nuqs";
import { useQueries } from "@tanstack/react-query";
import {
  getConversation,
  getMessages,
} from "@/lib/actions/conversation.action";
import { Input } from "../ui/input";
import MessageBubble from "./message-bubble";
import { LucideCamera, Paperclip, Phone, Send, X } from "lucide-react";
import initSocket from "@/lib/socket";
import { Message } from "@/types/global";
import Image from "next/image";

interface Auth {
  token: string;
}

const Chatarea = () => {
  const { data } = authClient.useSession();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userTyping, setUserTyping] = useState(false);
  const [typingUserImage, setTypingUserImage] = useState<string | null>(null);
  const [conversationId] = useQueryState("conversationId");
  const [socket, setSocket] = useState<any>(null);

  const [conversationQuery, messageQuery] = useQueries({
    queries: [
      {
        queryKey: ["conversation", conversationId],
        queryFn: async () =>
          await getConversation({
            token: data?.session.token as string,
            id: conversationId as string,
          }),
        enabled: !!conversationId && !!data?.session.token,
      },
      {
        queryKey: ["get-messages", conversationId],
        queryFn: async () =>
          await getMessages({
            token: data?.session.token as string,
            conversationId: conversationId as string,
          }),
        enabled: !!conversationId && !!data?.session.token,
      },
    ],
  });

  useEffect(() => {
    const socket = initSocket({ token: data?.session.token as string });
    if (!data?.session.token) return;
    (socket.auth as Auth).token = data?.session.token as string; // ensure token is fresh
    socket.connect();
    setSocket(socket);

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [data?.session.token]);

  useEffect(() => {
    console.log("messageQuery.data →", messageQuery?.data);
    if (!messageQuery.isPending) setMessages(messageQuery.data as Message[]);
  }, [messageQuery.isPending, messageQuery.data]);

  useEffect(() => {
    socket?.emit("join_conversation", { conversationId });

    socket?.on(
      "user_typing",
      ({
        profilePicture,
        userId,
        conversationId: convId,
        isTyping,
      }: {
        profilePicture: string;
        userId: string;
        conversationId: string;
        isTyping: boolean;
      }) => {
        if (convId === conversationId && userId !== data?.user.id) {
          setUserTyping(isTyping);
          setTypingUserImage(profilePicture);
        }
      }
    );

    socket?.on(
      "user_typing",
      ({
        userId,
        conversationId: convId,
        isTyping,
      }: {
        userId: string;
        conversationId: string;
        isTyping: boolean;
      }) => {
        if (convId === conversationId && userId !== data?.user.id) {
          setUserTyping(isTyping);
        }
      }
    );

    socket?.on("new_message", ({ message }: { message: any }) => {
      // Update the messages state with the new message
      setMessages((prevMessages: any) => [...prevMessages, message]);
    });

    return () => {
      socket?.off("user_typing");
    };
  }, [socket, conversationId, data?.user.id]);

  const conversation = conversationQuery.data;

  const currentContact = conversation?.participants.find(
    (member: any) => member.user._id !== data?.user.id
  );

  const handleStartTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    socket?.emit("typing_start", { conversationId });
    setNewMessage(e.target.value);
  };

  const handleStopTyping = () => {
    socket?.emit("typing_stop", { conversationId });
    setUserTyping(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket?.emit("send_message", {
        conversationId,
        content: {
          text: newMessage,
          media: selectedImage ? { url: selectedImage, type: "image" } : null,
        },
      });
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      {currentContact && (
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={currentContact.user.profilePicture || "/images/user.png"}
                alt={currentContact.user.name}
              />
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">
                  {currentContact.user.name}
                </h3>
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-[#4eaae9] flex items-center justify-center text-white hover:bg-[#3d8bc4]">
              <Phone size={15} />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#4eaae9] flex items-center justify-center text-white hover:bg-[#3d8bc4]">
              <LucideCamera size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages &&
          messages.length > 0 &&
          messages.map((message: any) => (
            <MessageBubble
              key={message._id}
              message={{
                id: message._id,
                text: message.content?.text,
                url: message.content?.media?.[0].url,
                timestamp: message.createdAt,
                isOwn: message.sender._id === data?.user.id,
                AvatarImage: message.sender.profilePicture,
              }}
            />
          ))}

        {/* Typing Indicator */}
        {userTyping && (
          <div className="flex items-end gap-2 mb-4">
            <Avatar>
              <AvatarImage
                src={typingUserImage || "/images/user.png"}
                alt="Contact"
                className="mb-1"
              />
            </Avatar>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            {selectedImage && (
              <div className="mb-2 w-32 h-32 flex items-center gap-2 p-2 border rounded bg-muted relative max-w-[200px]">
                <Image
                  src={selectedImage}
                  alt="Selected"
                  className="rounded"
                  fill
                  objectFit="cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-red-500 text-sm hover:underline absolute top-1 right-2">
                  <X />
                </button>
              </div>
            )}
            <Input
              placeholder="Message"
              value={newMessage}
              onChange={handleStartTyping}
              onKeyPress={handleKeyPress}
              className="pr-12 rounded-full border-2 border-[#4eaae9] focus:border-[#3d8bc4]"
              onBlur={handleStopTyping}
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setSelectedImage(reader.result as string); // Base64 string
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4eaae9] hover:text-[#3d8bc4]">
              <Paperclip />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            className="w-10 h-10 rounded-full bg-[#4eaae9] flex items-center justify-center text-white hover:bg-[#3d8bc4] transition-colors">
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatarea;
