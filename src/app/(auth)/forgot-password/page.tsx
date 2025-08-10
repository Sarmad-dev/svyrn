import ForgotPasswordForm from "@/components/auth/forms/forgot-password-form";
import MobileForgotPasswordForm from "@/components/auth/forms/mobile-forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const ForgotPassword = () => {
  return (
    <>
      <Card className="w-[400px] max-md:hidden block">
        <CardHeader className="sr-only">
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Please Sign in here</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
      <div className="md:hidden flex flex-col gap-3 items-center">
        <MobileForgotPasswordForm />
      </div>
    </>
  );
};

export default ForgotPassword;
