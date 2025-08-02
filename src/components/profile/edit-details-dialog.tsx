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
import { User } from "@/types/global";
import { EditProfileDetailsForm } from "./forms/edit-profile-details-form";

const EditProfileDetailsDialog = ({ user }: { user: User }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-gray-400 text-gray-50">
          Edit Profile Details
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile Details</DialogTitle>
          <DialogDescription className="sr-only">
            Edit your profile
          </DialogDescription>
        </DialogHeader>
        <EditProfileDetailsForm user={user} />
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDetailsDialog;
