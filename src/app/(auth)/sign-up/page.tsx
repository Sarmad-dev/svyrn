import MobileSignupForm from "@/components/auth/forms/mobile-signup-form";
import SignupForm from "@/components/auth/forms/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const SignUp = () => {
  return (
    <>
      <Card className="w-[400px] max-md:hidden block">
        <CardHeader className="sr-only">
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Please Sign in here</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
      <div className="md:hidden flex flex-col gap-3 items-center">
        <MobileSignupForm />
      </div>
    </>
  );
};

export default SignUp;
