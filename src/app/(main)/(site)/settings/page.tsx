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
import { getMe } from "@/lib/actions/user.action";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { settingSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Loader2 } from "lucide-react";
import React from "react";
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
  const { data: user, isPending } = useQuery({
    queryKey: ["get-me"],
    queryFn: async () => await getMe(session?.session.token as string),
    enabled: !!session?.session.token,
  });

  const form = useForm<z.infer<typeof settingSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(settingSchema),
    defaultValues: {
      firstName: user?.name.split(" ")[0],
      lastName: user?.name.split(" ")[1],
      gender: user?.gender,
      dateOfBirth: user?.dateOfBirth as Date,
    },
  });

  if (isUserPending || isPending) {
    return (
      <div className="w-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3 max-md:px-3">
      <h2 className="text-lg font-semibold">Settings</h2>
      <p className="font-medium">Account Information</p>
      <Separator />

      <Form {...form}>
        <form>
          <FormLabel className="mb-2">Name</FormLabel>
          <Input value={user?.name} disabled />
          <FormLabel className="mt-5 mb-2">Email</FormLabel>
          <Input value={user?.email} disabled />
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
                        defaultValue={field.value}
                        onValueChange={field.onChange}>
                        <SelectTrigger className="w-full data-[size=default]:h-[50px]">
                          <SelectValue
                            className=""
                            placeholder="Select a gender"
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
        </form>
      </Form>
    </div>
  );
};

export default Page;
