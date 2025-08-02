import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import EditProfileFrom from "./forms/edit-profile-form";
import { User } from "@/types/global";

const EditProfileDialog = ({ user }: { user: User }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-gray-400 text-gray-50">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription className="sr-only">
            Edit your profile
          </DialogDescription>
        </DialogHeader>
        <EditProfileFrom user={user} />
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
