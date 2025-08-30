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
import { Loader2, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import Image from "next/image";

const MobileSigninForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
    <div className="h-fit bg-gray-50 flex flex-col w-[calc(100vw-50px)] mx-auto">
      <div className="flex-1 flex items-center justify-center p-4 px-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-black">SVRYN SOCIAL</h1>
            <p className="text-gray-600">Welcome back</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        className="h-12 rounded-lg border-gray-300 text-gray-900 placeholder:text-gray-500"
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="h-12 rounded-lg border-gray-300 text-gray-900 placeholder:text-gray-500 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-gray-600">
                  Forget Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Login"}
              </Button>

              {/* Divider */}
              <div className="flex items-center space-x-4 my-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Social Login */}
              <div className="flex justify-center space-x-8">
                <button type="button" className="text-gray-700" onClick={() => authClient.signIn.social({ provider: "google" })}>
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </button>
                <button type="button" className="text-gray-700" onClick={() => authClient.signIn.social({ provider: "apple" })}>
                  <Image src="/icons/apple-logo.png" alt="apple" width={24} height={24} />
                </button>
              </div>

              <div className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="font-semibold text-gray-900">
                  Sign Up.
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default MobileSigninForm;
