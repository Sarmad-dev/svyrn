import { toast } from "sonner";
import { getLocation } from "../utils";
import { createPostSchema } from "./../validations";

import z from "zod";
import { config } from "../config";

export const createPost = async (
  data: z.infer<typeof createPostSchema> & { groupId: string; pageId: string },
  token: string
) => {
  try {
    const validatedData = createPostSchema.parse(data);

    const { latitude, longitude } = await getLocation();

    const response = await fetch(`${config.apiUrl}/api/posts`, {
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
    });

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
      `${config.apiUrl}/api/posts/feed?latitude=${latitude}&longitude=${longitude}`,
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

export const creatComment = async ({
  token,
  postId,
  content,
}: {
  token: string;
  postId: string;
  content: string;
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
      }),
    });

    const response = await res.json();
    if (response.status === "success") {
      toast.success(response.message); // Return the comment object if needed in yo
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};

export const getComments = async ({
  postId,
  token,
}: {
  postId: string;
  token: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/posts/${postId}/comments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Something went wrong");
    }

    const res = await response.json();

    console.log("Data: ", res.data.comments);

    if (res.status === "success") {
      return res.data.comments;
    } else {
      toast.success(res.message);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getPostMedia = async (postId: string, token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/media`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Something went wrong");
    }

    const res = await response.json();

    if (res.status === "success") {
      return res.data.media;
    } else {
      toast.success(res.message);
    }
  } catch (error) {
    console.log(error);
  }
};
