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
import { config } from "@/lib/config";
import { forgotPasswordSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const MobileForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    mode: "onChange",
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    await authClient.requestPasswordReset(
      {
        email: data.email,
        redirectTo: `${config.url}/reset-password`,
      },
      {
        onSuccess: () => {
          toast.success("Reset Password lint send to your email");
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
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground">
            Enter you email to reset password
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
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Send Reset Link"
          )}
        </Button>
        <div className="w-full flex justify-end">
          <Link href="/sign-in" className="text-primary">
            Back to Signin
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default MobileForgotPasswordForm;
