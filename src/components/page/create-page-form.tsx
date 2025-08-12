"use client";
import { createPageSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { createPage } from "@/lib/actions/page.action";

const CreatePageForm = () => {
  const { data: session, isPending: isUserPending } = authClient.useSession();

  const form = useForm<z.infer<typeof createPageSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(createPageSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      privacy: "public",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-page"],
    mutationFn: async (data: z.infer<typeof createPageSchema>) =>
      await createPage({ token: session?.session.token as string, ...data }),
  });

  const onSubmit = async (data: z.infer<typeof createPageSchema>) => {
    await mutateAsync(data);
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Page name (required)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="category"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Category (required)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Description"
                  {...field}
                  className="min-h-[130px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="privacy"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <RadioGroup
                className="flex flex-col gap-2"
                onValueChange={field.onChange}
                defaultValue={field.value}>
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <RadioGroupItem value="public" />
                  </FormControl>
                  <FormLabel className="font-normal">Public</FormLabel>
                </FormItem>
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <RadioGroupItem value="friends" />
                  </FormControl>
                  <FormLabel className="font-normal">Friends</FormLabel>
                </FormItem>
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="mt-1 w-full"
          disabled={isUserPending || isPending || isSubmitting}>
          {isSubmitting || isPending ? "Creating..." : "Create Page"}
        </Button>
      </form>
    </Form>
  );
};

export default CreatePageForm;
