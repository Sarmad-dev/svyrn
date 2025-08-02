import { ChatContact } from "@/types/global";
import { Avatar, AvatarImage } from "../ui/avatar";

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
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer w-full flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors ${
        isActive ? "bg-blue-50 border-r-2 border-[#4eaae9]" : ""
      }`}>
      <div className="relative">
        <Avatar>
          <AvatarImage src={contact.AvatarImage} alt={contact.name} />
        </Avatar>
        {contact.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">{contact.name}</h4>
          <span className="text-xs text-gray-500">{contact.timestamp}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">
          {contact.lastMessage.content.text}
        </p>
      </div>
    </button>
  );
};
