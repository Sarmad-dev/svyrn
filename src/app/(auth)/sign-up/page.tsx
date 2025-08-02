import SignupForm from "@/components/auth/forms/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SignUp = () => {
  return (
    <Card className="w-[400px]">
      <CardHeader className="sr-only">
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Please Sign in here</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  );
};

export default SignUp;
