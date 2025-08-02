import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarImage } from "../ui/avatar";
import { getMe } from "@/lib/actions/user.action";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { formatDateBeautiful } from "@/lib/utils";

interface Message {
  id: number;
  text: string;
  url: string;
  timestamp: string;
  isOwn: boolean;
  AvatarImage?: string;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { data } = authClient.useSession();
  const { data: user } = useQuery({
    queryKey: ["get-me"],
    queryFn: async () => await getMe(data?.session.token as string),
    enabled: !!data?.session.token,
  });
  return (
    <div
      className={`flex items-end gap-2 mb-4 ${
        message.isOwn ? "justify-end" : "justify-start"
      }`}>
      {!message.isOwn && (
        <Avatar>
          <AvatarImage
            src={message.AvatarImage || "/images/user.png"}
            alt="Contact"
            className="mb-1"
          />
        </Avatar>
      )}
      <div
        className={`max-w-xs lg:max-w-md ${
          message.isOwn ? "order-1" : "order-2"
        }`}>
        {message.url && (
          <div className="mb-2 w-80 h-60 relative rounded-md">
            <Image
              src={message.url}
              alt="Image"
              fill
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )}
        <div
          className={`px-4 py-2 rounded-2xl ${
            message.isOwn
              ? "bg-[#4eaae9] text-white rounded-br-md"
              : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
          }`}>
          <p className="text-sm">{message.text}</p>
        </div>
        <div
          className={`text-xs text-gray-500 mt-1 ${
            message.isOwn ? "text-right" : "text-left"
          }`}>
          {formatDateBeautiful(message.timestamp)}
        </div>
      </div>
      {message.isOwn && (
        <Avatar>
          <AvatarImage
            src={user?.profilePicture || "/images/user.png"}
            alt="You"
            className="mb-1"
          />
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
