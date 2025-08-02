import { toast } from "sonner";
import { getLocation } from "../utils";
import { createPostSchema } from "./../validations";

import z from "zod";

export const createPost = async (
  data: z.infer<typeof createPostSchema> & { groupId: string; pageId: string },
  token: string
) => {
  try {
    const validatedData = createPostSchema.parse(data);

    const { latitude, longitude } = await getLocation();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...validatedData,
          latitude,
          longitude,
        }),
      }
    );

    if (!response.ok) {
      toast.error("Something went wrong");
    }

    const res = await response.json();

    if (res.status === "success") {
      toast.success(res.message);
    } else {
      toast.success(res.message);
    }

    return { post: res.data.post };
  } catch (error) {
    console.log(error);
  }
};

export const getPosts = async (token: string) => {
  try {
    const { latitude, longitude } = await getLocation();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/feed?latitude=${latitude}&longitude=${longitude}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const res = await response.json();

    return res.data.posts;
  } catch (error) {
    console.log(error);
  }
};
