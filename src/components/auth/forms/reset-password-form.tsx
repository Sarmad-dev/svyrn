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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const ResetPasswordForm = () => {
  const searcParams = useSearchParams();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    await authClient.resetPassword(
      {
        newPassword: data.newPassword,
        token: searcParams.get("token")!,
      },
      {
        onSuccess: () => {
          toast.success(
            "Password reset successfully, you can now login with your new password."
          );
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
            Enter new password to reset your password
          </h3>
        </div>
        <FormField
          name="newPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="New Password"
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
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Reset"}
        </Button>
        <Link href="/sign-in" className="text-primary">
          Back to Signin
        </Link>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
