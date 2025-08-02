"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { userInfoSchema } from "@/lib/validations";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/global";
import { updateUser } from "@/lib/actions/user.action";
import { Loader2 } from "lucide-react";

export function EditProfileDetailsForm({ user }: { user: User }) {
  const { data: session } = authClient.useSession();
  const queryCLient = useQueryClient();

  const { mutateAsync, isPending: isMuatatePending } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (data: z.infer<typeof userInfoSchema>) =>
      await updateUser<z.infer<typeof userInfoSchema>>({
        token: session?.session.token as string,
        data,
      }),
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["get-me"] });
    },
  });

  const form = useForm<z.infer<typeof userInfoSchema>>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      worksAt: user.worksAt,
      livesIn: user.livesIn,
      From: user.From,
      martialStatus: user.martialStatus as
        | "single"
        | "married"
        | "engaged"
        | "in a relationship"
        | "complicated",
    },
  });

  const onSubmit = async (values: z.infer<typeof userInfoSchema>) => {
    await mutateAsync(values);
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="worksAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Works at</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Google" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="livesIn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lives in</FormLabel>
              <FormControl>
                <Input placeholder="e.g. New York" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="From"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Lahore" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="martialStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marital Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="engaged">Engaged</SelectItem>
                  <SelectItem value="in a relationship">
                    In a Relationship
                  </SelectItem>
                  <SelectItem value="complicated">Complicated</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-[130px]"
          disabled={isMuatatePending || isSubmitting}>
          {isMuatatePending || isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Update Info"
          )}
        </Button>
      </form>
    </Form>
  );
}
