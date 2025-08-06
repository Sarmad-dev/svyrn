import ResetPasswordForm from "@/components/auth/forms/reset-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const ResetPassword = () => {
  return (
    <>
      <Card className="w-[400px] max-md:hidden block">
        <CardHeader className="sr-only">
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Please Sign in here</CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
      <div className="md:hidden flex flex-col gap-3 items-center">
        <Image
          src={"/icons/logo-gray.png"}
          width={150}
          height={150}
          alt="logo"
        />
        <ResetPasswordForm />
      </div>
    </>
  );
};

export default ResetPassword;
