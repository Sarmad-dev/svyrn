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

interface GetPostsParams {
  token: string;
  page?: number;
  limit?: number;
  cursor?: string;
  includeAds?: boolean;
}

export const getPosts = async ({ 
  token, 
  page = 1, 
  limit = 10, 
  cursor, 
  includeAds = true 
}: GetPostsParams) => {
  try {
    console.log('[DEBUG] getPosts called with:', { token: !!token, page, limit, cursor, includeAds });
    
    const { latitude, longitude } = await getLocation();
    
    // Build query parameters
    const queryParams = new URLSearchParams({
      latitude: latitude?.toString() || '',
      longitude: longitude?.toString() || '',
      page: page.toString(),
      limit: limit.toString(),
      includeAds: includeAds.toString(),
    });

    // Add cursor if provided for infinite scrolling
    if (cursor) {
      queryParams.append('cursor', cursor);
      console.log('[DEBUG] Added cursor to request:', cursor);
    } else {
      console.log('[DEBUG] No cursor provided - first page request');
    }

    const url = `${config.apiUrl}/api/posts/feed?${queryParams.toString()}`;
    console.log('[DEBUG] Fetching URL:', url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('[DEBUG] Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    
    console.log('[DEBUG] API Response:', res);

    if (res.status === "success") {
      const result = {
        posts: res.data.posts,
        pagination: res.data.pagination,
        metadata: res.data.metadata,
      };
      console.log('[DEBUG] Returning result:', result);
      return result;
    } else {
      throw new Error(res.message || "Failed to fetch posts");
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Keep the old function for backward compatibility but mark as deprecated
export const getPostsLegacy = async (token: string) => {
  try {
    const result = await getPosts({ token, page: 1, limit: 10 });
    return result.posts;
  } catch (error) {
    console.log(error);
    return [];
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

export const sharePost = async ({
  token,
  postId,
  destination,
  caption,
  groupId,
  conversationId,
}: {
  token: string;
  postId: string;
  destination: "feed" | "group" | "conversation";
  caption?: string;
  groupId?: string;
  conversationId?: string;
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/posts/${postId}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ destination, caption, groupId, conversationId }),
    });

    const response = await res.json();
    if (response.status === "success") {
      toast.success(response.message);
      return response.data;
    } else {
      toast.error(response.message);
      throw new Error(response.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to share");
    throw error;
  }
};