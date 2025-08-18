import { Author, Post, User } from "@/types/global";
import { config } from "../config";
import { toast } from "sonner";

export const getUserProfile = async (
  userId: string,
  token: string
): Promise<{ user: User | null }> => {
  try {
    const response = await fetch(`${config.apiUrl}/api/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return { user: data.data.user as User };
  } catch (error) {
    console.log(error);
    return { user: null };
  }
};

export const getMe = async (token: string): Promise<User | undefined> => {
  try {
    const response = await fetch(`${config.apiUrl}/api/users/my-profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log("ERROR: ", response);
    }

    const data = await response.json();

    if (data.status === "error") {
      toast.error(data.message);
    }

    return data.data.user as User;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async <T>({
  token,
  data,
}: {
  token: string;
  data: T;
}) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/users/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      toast.error("Something went wrong");
      return null;
    }

    const responseData = await response.json();

    if (responseData.status === "success") {
      toast.success(responseData.message);
      return responseData.data.user as User;
    } else {
      toast.error(responseData.message);
      return null;
    }
  } catch (error) {
    console.log("Errors: ", error);
    toast.error("Something went wrong");
  }
};

export const getUserPosts = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/users/${userId}/posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      toast.error("Something went wrong");
    }

    const data = await response.json();

    if (data.status === "error") {
      toast.error(data.message);
    }

    return data.data.posts as Post[];
  } catch (error) {
    console.log(error);
  }
};

export const followUser = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/users/${userId}/follow`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Something went wrong");
    }
    const data = await response.json();

    if (data.status === "error") {
      toast.error(data.message);
    }

    return data.data.user as User;
  } catch (error) {
    console.log(error);
  }
};

export const unfollowUser = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/users/${userId}/unfollow`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Something went wrong");
    }

    const data = await response.json();

    if (data.status === "error") {
      toast.error(data.message);
    }

    return data.data.user as User;
  } catch (error) {
    console.log(error);
  }
};

export const getUserFollowers = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/users/${userId}/followers`,
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

    const data = await response.json();

    if (data.status === "error") {
      toast.error(data.message);
    }

    return data.data.followers as Author[];
  } catch (error) {
    console.log(error);
  }
};

export const getUserFollowing = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/users/${userId}/following`,
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

    const data = await response.json();

    if (data.status === "error") {
      toast.error(data.message);
    }

    return data.data.following as Author[];
  } catch (error) {
    console.log(error);
  }
};

export const getSimilarUsers = async ({ token }: { token: string }) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/recommendations/similar-users`,
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

    const data = await response.json();

    if (data.status === "error") {
      toast.error(data.message);
    }

    return data.data.users;
  } catch (error) {
    console.log(error);
  }
};

export const searchUsers = async ({
  token,
  search,
}: {
  token: string;
  search: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/users/search?q=${search}`,
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

    const data = await response.json();

    if (data.status === "error") {
      toast.error(data.message);
    }

    return {
      users: data.data.users,
      pagination: data.data.pagination,
    };
  } catch (error) {
    console.log(error);
  }
};

export const getOnlineUsers = async ({ token }: { token: string }) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/status/online-users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      toast.error("Something went wrong");
    }

    const data = await response.json();

    if (data.status === "error") {
      toast.error(data.message);
    }

    return data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserPhotos = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/users/${userId}/photos`,
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

    const data = await response.json();

    if (data.status === "error") {
      toast.error(data.message);
    }

    return data.data.photos;
  } catch (error) {
    console.log(error);
  }
};

export const getUserVideos = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/users/${userId}/videos`,
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

    const data = await response.json();

    if (data.status === "error") {
      toast.error(data.message);
    }

    return data.data.videos;
  } catch (error) {
    console.log(error);
  }
};
