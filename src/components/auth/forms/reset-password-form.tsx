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
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold">Create new password</h2>
          <p className="text-sm text-muted-foreground">Use a strong and unique password</p>
        </div>
        <div className="rounded-2xl border bg-white/80 backdrop-blur p-4 shadow-lg space-y-4">
          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock size={18} />
                    </span>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="New password"
                      className="pl-9 pr-10 h-12 rounded-xl"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#4dabf7] to-[#6fb3ff] text-white shadow-md active:scale-[0.98] transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Reset password"}
        </Button>
        <div className="text-center text-sm">
          <Link href="/sign-in" className="text-primary font-semibold">
            Back to sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
