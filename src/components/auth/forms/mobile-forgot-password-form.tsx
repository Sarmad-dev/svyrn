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
import { Loader2, Mail } from "lucide-react";
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold">Reset password</h2>
          <p className="text-sm text-muted-foreground">We’ll email you a reset link</p>
        </div>

        <div className="rounded-2xl border bg-white/80 backdrop-blur p-4 shadow-lg space-y-4">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail size={18} />
                    </span>
                    <Input placeholder="Email address" className="pl-9 h-12 rounded-xl" {...field} />
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
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Send reset link"}
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

export default MobileForgotPasswordForm;
