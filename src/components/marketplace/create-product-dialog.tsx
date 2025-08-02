import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CreateProductForm from "./create-producct-form";

const CreateProductDialog = ({ children }: { children: ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sell You Product</DialogTitle>
          <DialogDescription>All Fields are required</DialogDescription>
        </DialogHeader>
        <CreateProductForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductDialog;
