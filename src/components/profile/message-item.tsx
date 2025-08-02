import Image from "next/image";
import Link from "next/link";

interface MessageItemProps {
  conversationId: string;
  profilePicture: string;
  name: string;
  lastMessage: string;
  time: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  conversationId,
  profilePicture,
  name,
  lastMessage,
  time,
}) => {
  return (
    <Link href={`/chat?conversationId=${conversationId}`}>
      <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
        <div className="w-10 h-10 relative bg-gray-100 rounded-full">
          <Image
            src={profilePicture || "/images/user.png"}
            alt="Profile Picture"
            fill
            className="rounded-full"
            objectFit="cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{lastMessage}</p>
        </div>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
    </Link>
  );
};

export default MessageItem;
