"use client";
import { GroupWithPosts } from "@/types/global";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { groupSettingsSchema } from "@/lib/validations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGroup } from "@/lib/actions/group.action";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

const SettingsTabContent = ({ group }: { group: GroupWithPosts }) => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["update-group-settings"],
    mutationFn: async (data: z.infer<typeof groupSettingsSchema>) => {
      return await updateGroup(
        { settings: { ...data } },
        session?.session.token as string,
        group._id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-group", group._id] });
    },
  });

  const form = useForm<z.infer<typeof groupSettingsSchema>>({
    resolver: zodResolver(groupSettingsSchema),
    defaultValues: {
      allowMemberInvites: group.settings.allowMemberInvites,
      allowMemberPosts: group.settings.allowMemberPosts,
      approveMembers: group.settings.approveMembers,
    },
  });

  async function onSubmit(data: z.infer<typeof groupSettingsSchema>) {
    await mutateAsync(data);
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="allowMemberInvites"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Allow members Invites</FormLabel>
                    <FormDescription>
                      Allow members to invite other members to your group.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allowMemberPosts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Allow Members Post</FormLabel>
                    <FormDescription>
                      Allow members to post in your group.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="approveMembers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Approve Members</FormLabel>
                    <FormDescription>
                      Allow approval of members before they can join your group.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" disabled={isPending || isSubmitting}>
          {isPending || isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SettingsTabContent;
