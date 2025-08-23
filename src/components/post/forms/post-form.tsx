import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createPostSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createPost } from "@/lib/actions/post.action";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import MultiMediaUploader, { UploadedFile } from "@/components/multi-media-uploader";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const privacyOptions = [
  { value: "public", label: "Public" },
  { value: "friends", label: "Friends" },
  { value: "private", label: "Private" },
];

const PostForm = ({
  groupId,
  pageId,
}: {
  groupId?: string;
  pageId?: string;
}) => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-post"],
    mutationFn: async (data: z.infer<typeof createPostSchema>) => {
      return await createPost(
        { ...data, pageId: pageId as string, groupId: groupId as string },
        session?.session.token as string
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-posts", "get-group", groupId],
      });
    },
  });
  const form = useForm<z.infer<typeof createPostSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      text: "",
      groupId: "",
      pageId: "",
      privacy: "public",
    },
  });

  const handleUpload = (files: UploadedFile[]) => {
    if (files.length === 0) {
      form.setValue("mediaFiles", []);
      return;
    }
    
    // Set all files as mediaFiles (using base64 for backend)
    form.setValue("mediaFiles", files.map(file => file.base64));
  };

  const onSubmit = async (data: z.infer<typeof createPostSchema>) => {
    await mutateAsync(data);
  };

  const isSUbmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-3">
        <FormField
          name="text"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="What's on your mind, Gadget?"
                  {...field}
                  className="max-h-56 min-h-48"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="mediaFiles"
          control={form.control}
          render={() => (
            <FormItem>
              <FormControl>
                <MultiMediaUploader onUpload={handleUpload} maxFiles={10} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacy"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col">
                  {privacyOptions.map((option) => (
                    <FormItem
                      key={option.value}
                      className="flex items-center gap-3 border border-primary rounded-md py-3 px-2">
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isSUbmitting || isPending}
          className="w-full h-[50px] bg-primary text-[#5E6E79] cursor-pointer">
          {isSUbmitting || isPending ? "Posting..." : "Post"}
        </Button>
      </form>
    </Form>
  );
};

export default PostForm;
