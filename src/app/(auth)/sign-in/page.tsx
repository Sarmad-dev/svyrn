import MobileSigninForm from "@/components/auth/forms/mobile-signin-form";
import SigninForm from "@/components/auth/forms/signin-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const SignIn = () => {
  return (
    <>
      <Card className="w-[400px] max-md:hidden block">
        <CardHeader className="sr-only">
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Please Sign in here</CardDescription>
        </CardHeader>
        <CardContent>
          <SigninForm />
        </CardContent>
      </Card>
      <div className="md:hidden flex flex-col gap-3 items-center">
        <MobileSigninForm />
      </div>
    </>
  );
};

export default SignIn;
