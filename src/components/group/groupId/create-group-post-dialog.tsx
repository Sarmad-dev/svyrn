import PostForm from "@/components/post/forms/post-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/types/global";
import Image from "next/image";
import React from "react";

const CreateGroupPostDialog = ({
  groupId,
  pageId,
  user,
}: {
  groupId?: string;
  pageId?: string;
  user: User;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-muted-foreground flex-1 rounded-full">
          Write something here...
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription className="sr-only">
            Create a post
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <div className="relative h-[40px] w-[40px] rounded-full">
            <Image src="/images/user.png" alt="user" fill objectFit="contain" />
          </div>
          <div className="flex flex-col gap-0.5">{user?.name}</div>
        </div>
        <PostForm groupId={groupId} pageId={pageId} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupPostDialog;
