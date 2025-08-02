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
import { signinSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const SigninForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    mode: "onChange",
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("Login successful");
          router.push("/home");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email"
                  className="placeholder:text-primary border-[#3737378C]"
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
                  className="placeholder:text-primary border-[#3737378C]"
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
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Login"}
        </Button>
        <div className="w-full flex justify-end">
          <Link href="/forgot-password" className="text-primary">
            Forgot Password
          </Link>
        </div>
        <Link
          href="/sign-up"
          className="w-full h-[50px] flex items-center justify-center rounded-lg bg-[#4EAAE9] py-0">
          <Image src="/icons/join.png" alt="join" width={105} height={70} />
        </Link>
      </form>
    </Form>
  );
};

export default SigninForm;
