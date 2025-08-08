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
import { Loader2, UserRound, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold">Create your account</h2>
          <p className="text-sm text-muted-foreground">Start your experience with us</p>
        </div>

        <div className="rounded-2xl border bg-white/80 backdrop-blur p-4 shadow-lg space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <UserRound size={18} />
                    </span>
                    <Input placeholder="Full name" className="pl-9 h-12 rounded-xl" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            name="password"
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
                      placeholder="Create a password"
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
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Create account"}
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary font-semibold">
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default MobileSignupForm;
