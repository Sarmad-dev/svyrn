import { Paperclip } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";

const ChatInput = () => {
  return (
    <div className="flex-1 relative">
      <Input
        placeholder="Message"
        value={newMessage}
        onChange={handleStartTyping}
        onKeyPress={handleKeyPress}
        className="pr-12 rounded-full border-2 border-[#4eaae9] focus:border-[#3d8bc4]"
        onBlur={handleStopTyping}
      />
      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4eaae9] hover:text-[#3d8bc4]">
        <Paperclip />
      </button>
    </div>
  );
};

export default ChatInput;
