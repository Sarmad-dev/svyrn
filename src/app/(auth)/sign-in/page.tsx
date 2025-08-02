import SigninForm from "@/components/auth/forms/signin-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SignIn = () => {
  return (
    <Card className="w-[400px]">
      <CardHeader className="sr-only">
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Please Sign in here</CardDescription>
      </CardHeader>
      <CardContent>
        <SigninForm />
      </CardContent>
    </Card>
  );
};

export default SignIn;
