import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateUser } from "@/lib/actions/user.action";
import { authClient } from "@/lib/auth-client";
import { editProfileSchema } from "@/lib/validations";
import { User } from "@/types/global";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const EditProfileFrom = ({ user }: { user: User }) => {
  const { data: session } = authClient.useSession();
  const queryCLient = useQueryClient();

  const { mutateAsync, isPending: isMuatatePending } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (data: z.infer<typeof editProfileSchema>) =>
      await updateUser<z.infer<typeof editProfileSchema>>({
        token: session?.session.token as string,
        data,
      }),
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["get-me"] });
    },
  });

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name,
      bio: user.bio,
      location: user.location,
      website: user.website,
      currentJob: user.currentJob,
    },
  });

  const onSubmit = async (data: z.infer<typeof editProfileSchema>) => {
    await mutateAsync(data);
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="w-full border border-gray-200 rounded-md p-2"
                  placeholder="Name"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="currentJob"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Job</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="w-full border border-gray-200 rounded-md p-2"
                  placeholder="Name"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="location"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="w-full border border-gray-200 rounded-md p-2"
                  placeholder="Name"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="website"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="w-full border border-gray-200 rounded-md p-2"
                  placeholder="Name"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="bio"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="w-full border min-h-[180px] border-gray-200 rounded-md p-2"
                  placeholder="Name"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button
            className="w-[130px]"
            disabled={isSubmitting || isMuatatePending}>
            {isSubmitting || isMuatatePending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Update"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EditProfileFrom;
