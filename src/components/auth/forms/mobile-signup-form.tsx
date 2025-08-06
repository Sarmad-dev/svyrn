"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { signupSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const MobileSignupForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof signupSchema>>({
    mode: "onChange",
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    const { email, password, name } = data;
    console.log(email, password, name);

    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onSuccess: async () => {
          toast.success("Sign Up successfull");
          router.push("/home");
        },
        onError: (ctx) => {
          console.log(ctx.error);
          toast.error(ctx.error.message);
        },
      }
    );
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground">
            Create your account to continue
          </h3>
        </div>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email"
                  className="placeholder:text-primary border-[#3737378C] rounded-sm h-[50px] w-[calc(100vw-8rem)]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Password"
                  className="placeholder:text-primary border-[#3737378C] rounded-sm h-[50px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Name"
                  className="placeholder:text-primary border-[#3737378C] rounded-sm h-[50px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="text-white w-full 2xl:h-[50px] cursor-pointer"
          disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign Up"}
        </Button>
        <div className="w-full flex justify-end text-sm">
          <span>No Account?</span>{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>{" "}
          <span>here</span>
        </div>
      </form>
    </Form>
  );
};

export default MobileSignupForm;
