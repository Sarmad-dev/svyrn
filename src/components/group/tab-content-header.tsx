import React from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { CreateGroupModal } from "./create-group-modal";

const TabContentHeader = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="flex items-center justify-between">
      {children}
      <Button
        className="border-none text-blue-400"
        variant="outline"
        onClick={() => setIsOpen(true)}>
        <PlusCircle className="text-blue-400" />
        Create Group
      </Button>
      <CreateGroupModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default TabContentHeader;
