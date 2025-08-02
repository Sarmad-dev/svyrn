// components/GroupRulesDialog.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupWithPosts } from "@/types/global";
import { updateGroup } from "@/lib/actions/group.action";
import { authClient } from "@/lib/auth-client";

const ruleSchema = z.object({
  rules: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
    })
  ),
});

type RuleFormSchema = z.infer<typeof ruleSchema>;

export default function GroupRulesDialog({ group }: { group: GroupWithPosts }) {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["update-group-rules", group._id],
    mutationFn: async (data: RuleFormSchema) =>
      await updateGroup(data, session?.session.token as string, group._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-group", group._id] });
      console.log("Rules updated successfully");
    },
  });

  const form = useForm<RuleFormSchema>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      rules: [{ title: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  const onSubmit = async (data: RuleFormSchema) => {
    await mutateAsync(data);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit2 />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Group Rules</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border p-4 rounded-2xl bg-muted/30 relative space-y-4">
                <div className="absolute top-3 right-3">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(index)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name={`rules.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter rule title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`rules.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Enter rule description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => append({ title: "", description: "" })}>
              <Plus className="w-4 h-4" />
              Add Another Rule
            </Button>

            <DialogFooter>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isPending}>
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Save Rules"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
