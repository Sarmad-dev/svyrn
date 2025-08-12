/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "@/lib/config";
import { toast } from "sonner";

export const createPage = async ({
  token,
  name,
  description,
  category,
  privacy,
  username,
  profilePicture,
  coverPhoto,
}: {
  token: string;
  name: string;
  description?: string;
  category: string;
  privacy?: string;
  username?: string;
  profilePicture?: string;
  coverPhoto?: string;
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        category,
        privacy: privacy || "public",
        username,
        profilePicture,
        coverPhoto,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create page");
    }

    const response = await res.json();
    return response.data.page;
  } catch (error: any) {
    toast.error(error.message || "Failed to create page");
    throw error;
  }
};

export const getMyPages = async ({ token }: { token: string }) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/pages/my-pages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to get your pages");
    }

    const response = await res.json();
    return response.data.pages;
  } catch (error: any) {
    toast.error(error.message || "Failed to get your pages");
    throw error;
  }
};

export const getFollowedPages = async ({ token }: { token: string }) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/pages/followed`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to get followed pages");
    }

    const response = await res.json();
    return response.data.pages;
  } catch (error: any) {
    toast.error(error.message || "Failed to get followed pages");
    throw error;
  }
};

export const getPages = async ({
  token,
  search,
  category,
  limit = 10,
  page = 1,
}: {
  token: string;
  search?: string;
  category?: string;
  limit?: number;
  page?: number;
}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (limit) params.append("limit", limit.toString());
    if (page) params.append("page", page.toString());

    const res = await fetch(`${config.apiUrl}/api/pages?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to get pages");
    }

    const response = await res.json();
    return response.data;
  } catch (error: any) {
    toast.error(error.message || "Failed to get pages");
    throw error;
  }
};

export const getPage = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/pages/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to get page");
    }

    const response = await res.json();
    return response.data;
  } catch (error: any) {
    toast.error(error.message || "Failed to get page");
    throw error;
  }
};

export const getPagePosts = async ({
  token,
  pageId,
  limit = 10,
  cursor,
}: {
  token: string;
  pageId: string;
  limit?: number;
  cursor?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (cursor) params.append("cursor", cursor);

    const res = await fetch(`${config.apiUrl}/api/pages/${pageId}/posts?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to get page posts");
    }

    const response = await res.json();
    return response.data;
  } catch (error: any) {
    toast.error(error.message || "Failed to get page posts");
    throw error;
  }
};

export const followPage = async ({
  token,
  pageId,
}: {
  token: string;
  pageId: string;
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/pages/${pageId}/follow`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to follow page");
    }

    toast.success("Page followed successfully");
    return true;
  } catch (error: any) {
    toast.error(error.message || "Failed to follow page");
    throw error;
  }
};

export const unfollowPage = async ({
  token,
  pageId,
}: {
  token: string;
  pageId: string;
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/pages/${pageId}/unfollow`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to unfollow page");
    }

    toast.success("Page unfollowed successfully");
    return true;
  } catch (error: any) {
    toast.error(error.message || "Failed to unfollow page");
    throw error;
  }
};

export const updatePage = async ({
  token,
  pageId,
  data,
}: {
  token: string;
  pageId: string;
  data: any;
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/pages/${pageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update page");
    }

    const response = await res.json();
    toast.success("Page updated successfully");
    return response.data.page;
  } catch (error: any) {
    toast.error(error.message || "Failed to update page");
    throw error;
  }
};
