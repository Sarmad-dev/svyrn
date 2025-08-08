import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { MessageSquare, PanelRightClose } from "lucide-react";
import { Button } from "../ui/button";
import ChatLeftside from "./chat-leftside";

const ChatSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg hover:bg-white"
        >
          <MessageSquare className="text-primary w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] sm:w-[380px] p-0">
        <SheetHeader className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <SheetTitle className="text-xl font-bold text-gray-900">
            Messages
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Select a conversation to start chatting
          </SheetDescription>
        </SheetHeader>
        <div className="h-full">
          <ChatLeftside />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;
