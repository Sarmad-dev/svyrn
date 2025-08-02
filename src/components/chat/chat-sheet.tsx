import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { PanelRightClose } from "lucide-react";
import { Button } from "../ui/button";
import ChatLeftside from "./chat-leftside";

const ChatSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="fixed top-32">
          <PanelRightClose className="text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Your Chats</SheetTitle>
          <SheetDescription>All of your chats appear here</SheetDescription>
        </SheetHeader>
        <ChatLeftside />
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;
