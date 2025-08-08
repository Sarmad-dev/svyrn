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
      <div className="flex items-center gap-3 p-4 bg-white border rounded-xl hover:shadow-sm transition-shadow">
        <div className="w-12 h-12 relative bg-gray-100 rounded-full overflow-hidden">
          <Image
            src={profilePicture || "/images/user.png"}
            alt="Profile Picture"
            fill
            className="rounded-full"
            objectFit="cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{name}</h4>
          <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
      </div>
    </Link>
  );
};

export default MessageItem;
