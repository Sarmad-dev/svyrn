import CreatePageForm from "@/components/page/create-page-form";
import { Separator } from "@/components/ui/separator";
import React from "react";

const Pages = () => {
  return (
    <div className="space-y-2 max-md:px-3">
      <h2 className="font-semibold text-lg">Create a Page</h2>
      <p className="text-muted-foreground">
        Your Page is where people go to learn more about you. Make sure yours
        has all the information they may need.
      </p>
      <Separator />

      <div className="mt-1">
        <CreatePageForm />
      </div>
    </div>
  );
};

export default Pages;
