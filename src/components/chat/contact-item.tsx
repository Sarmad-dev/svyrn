import { ChatContact } from "@/types/global";
import { Avatar, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ContactItemProps {
  contact: ChatContact;
  isActive: boolean;
  onClick: () => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  isActive,
  onClick,
}) => {
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-blue-50 border border-blue-200 shadow-sm"
          : "bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <Avatar className="w-12 h-12 ring-2 ring-white shadow-sm">
            <AvatarImage
              src={contact.AvatarImage}
              alt={contact.name}
              className="object-cover"
            />
          </Avatar>
          {contact.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          )}
        </div>

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 truncate text-sm">
              {contact.name}
            </h4>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatTime(contact.timestamp)}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate leading-relaxed">
            {contact.lastMessage?.content?.text || "No messages yet"}
          </p>
        </div>
      </div>
    </button>
  );
};
