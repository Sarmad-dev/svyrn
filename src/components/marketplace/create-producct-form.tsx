// components/PostForm.tsx
"use client";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Image from "next/image";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/lib/actions/product.action";
import { authClient } from "@/lib/auth-client";
import { LocationInput } from "../ui/location-input";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().nonnegative(),
  description: z.string().min(1, "Description is required"),
  privacy: z.enum(["public", "friends"]),
  images: z.any(),
  phone: z.string().optional(),
  location: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }).optional(),
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateProductForm() {
  const { data: session } = authClient.useSession();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [locationData, setLocationData] = useState<{
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: { latitude: number; longitude: number };
  } | null>(null);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-product"],
    mutationFn: async (data: FormValues) =>
      await createProduct({
        token: session?.session.token as string,
        data: {
          price: { amount: data.amount as number },
          description: data.description,
          images: data.images as string[],
          privacy: data.privacy,
          title: data.title,
          location: locationData || undefined,
          contact: {
            email: session?.user.email as string,
            phone: data.phone || '',
          },
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setImagePreviews([]);
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      privacy: "public",
    },
  });

  const onSubmit = async (data: FormValues) => {
    await mutateAsync(data);
  };

  const handleLocationChange = (location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: { latitude: number; longitude: number };
  }) => {
    setLocationData(location);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const previews = await Promise.all(
      Array.from(files).map((file) => toBase64(file))
    );

    setImagePreviews((prev) => [...prev, ...(previews as string[])]);
    const existingImages = getValues("images") ?? [];
    const updatedImages = [...existingImages, ...previews].filter(Boolean);

    setValue("images", updatedImages, {
      shouldValidate: true,
    });
  };

  const toBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
      {/* Title */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Title (required)"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          {...register("amount", { valueAsNumber: true })}
          placeholder="Amount (required)"
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          {...register("phone")}
          placeholder="Phone"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone?.message}</p>
        )}
      </div>

      {/* Location */}
      <LocationInput
        onChange={handleLocationChange}
        placeholder="Search for your location..."
        label="Location"
      />

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Privacy */}
      <div>
        <Label>Privacy</Label>
        <RadioGroup defaultValue="public" {...register("privacy")}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public">Public</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="friends" id="friends" />
            <Label htmlFor="friends">Friends</Label>
          </div>
        </RadioGroup>
        {errors.privacy && (
          <p className="text-sm text-red-500">{errors.privacy.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <Label>Upload Images</Label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 
                     file:rounded-md file:border-0 file:text-sm file:font-semibold 
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {imagePreviews.map((src, idx) => (
            <div className="w-full h-24 rounded relative" key={idx}>
              <Image
                src={src}
                alt={`preview-${idx}`}
                className="rounded"
                fill
                objectFit="cover"
              />
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create"}
      </Button>
    </form>
  );
}
