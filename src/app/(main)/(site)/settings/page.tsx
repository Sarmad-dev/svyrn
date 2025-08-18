"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getMe, updateUser } from "@/lib/actions/user.action";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { settingSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const Page = () => {
  const { data: session, isPending: isUserPending } = authClient.useSession();
  const queryClient = useQueryClient();
  const { data: user, isPending } = useQuery({
    queryKey: ["get-me"],
    queryFn: async () => await getMe(session?.session.token as string),
    enabled: !!session?.session.token,
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: z.infer<typeof settingSchema>) => {
      return await updateUser({ data, token: session?.session.token as string });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-me"] });
    },
  });

  const form = useForm<z.infer<typeof settingSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(settingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined as unknown as "male" | "female" | "other" | undefined,
      dateOfBirth: undefined,
    },
  });

  useEffect(() => {
    form.reset({
      firstName: user?.name ? user.name.split(" ")[0] ?? "" : "",
      lastName:
        user?.name && user.name.split(" ").length > 1
          ? user.name.split(" ").slice(1).join(" ")
          : "",
      gender: user?.gender,
      dateOfBirth: user?.dateOfBirth
        ? new Date(user.dateOfBirth as unknown as string)
        : undefined,
    });
  }, [user]);

  if (isUserPending || isPending) {
    return (
      <div className="w-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const handleSubmit = (data: z.infer<typeof settingSchema>) => {
    updateUserMutation.mutateAsync(data)
  };

  return (
    <div className="space-y-3 max-md:px-3">
      <h2 className="text-lg font-semibold">Settings</h2>
      <p className="font-medium">Account Information</p>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormLabel className="mb-2">Name</FormLabel>
          <Input value={user?.name ?? ""} disabled />
          <FormLabel className="mt-5 mb-2">Email</FormLabel>
          <Input value={user?.email ?? ""} disabled />
          <p className="block mt-5 font-medium">Personal Information</p>
          <Separator />
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-5 max-md:grid-cols-1">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1">
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                      
                    </FormControl>
                  </FormItem>
                </div>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1">
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                      
                    </FormControl>
                  </FormItem>
                </div>
              )}
            />
            <FormField
              name="gender"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1">
                  <FormItem className="flex-1">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        >
                        <SelectTrigger className="w-full data-[size=default]:h-[50px]">
                          <SelectValue
                            placeholder={field.value ? field.value.charAt(0).toUpperCase() + field.value.slice(1) : "Select a gender"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex-1 flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-[50px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}>
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="mt-5" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Page;
