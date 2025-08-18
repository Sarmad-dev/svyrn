/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { config } from "../config";
import { Group, GroupWithPosts, Post } from "@/types/global";

export const joinGroup = async ({
  groupId,
  message,
  token,
}: {
  groupId: string;
  message?: string;
  token: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/groups/${groupId}/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
        }),
      }
    );

    if (!response.ok) {
      toast.error("Failed to join group");
    }

    const data = await response.json();

    if (data.status === "success") {
      toast.success(data.message);
    } else {
      toast.error("Failed to join group");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getGroups = async ({
  token,
}: {
  token: string;
}): Promise<{
  groups: Group[];
  pagination: { limit: number; page: number; pages: number; total: number };
}> => {
  try {
    const res = await fetch(`${config.apiUrl}/api/groups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      toast.error("Failed to fetch groups");
    }

    const data = await res.json();

    if (data.status === "success") {
      console.log("Response: ", data.data);
      return data.data;
    } else {
      toast.error(data.message);
      return {
        groups: [],
        pagination: {
          limit: 0,
          page: 0,
          pages: 0,
          total: 0,
        },
      };
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
    return {
      groups: [],
      pagination: {
        limit: 0,
        page: 0,
        pages: 0,
        total: 0,
      },
    };
  }
};

export const createGroup = async ({
  name,
  description,
  privacy,
  image,
  token,
}: {
  name: string;
  description: string;
  privacy: string;
  image: string;
  token: string;
}) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        privacy,
        image,
      }),
    });

    if (!response.ok) {
      toast.error("An error occurred while creating the group");
    }

    const data = await response.json();

    if (data.status === "success") {
      toast.success("Group created successfully");
    } else {
      toast.error(data.message, data.error);
    }
  } catch (error) {
    console.error(error);
    toast.error("An error occurred while creating the group");
  }
};

export const getUserGroups = async ({ token }: { token: string }) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/groups/my-groups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      toast.error("Failed to fetch groups");
    }

    const data = await res.json();

    if (data.status === "success") {
      console.log("Response Groups: ", data.data.groups);
      return data.data.groups;
    } else {
      toast.error(data.message);
      return {
        groups: [],
        pagination: {
          limit: 0,
          page: 0,
          pages: 0,
          total: 0,
        },
      };
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
    return {
      groups: [],
      pagination: {
        limit: 0,
        page: 0,
        pages: 0,
        total: 0,
      },
    };
  }
};

export const getGroup = async ({
  groupId,
  token,
}: {
  groupId: string;
  token: string;
}): Promise<GroupWithPosts | null> => {
  try {
    const res = await fetch(`${config.apiUrl}/api/groups/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      toast.error("Failed to fetch group");
    }

    const data = await res.json();

    if (data.status === "success") {
      return data.data.group;
    } else {
      toast.error(data.message);
      return null;
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
    return null;
  }
};

export const updateGroup = async (
  data: any,
  token: string,
  groupId: string
) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/groups/${groupId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      toast.error("Failed to update group");
    }

    const response = await res.json();

    if (response.status === "success") {
      toast.success(response.message);
    } else {
      toast.error(response.message);
      return;
    }

    return response.data.group;
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

export const updateCoverPhoto = async ({
  image,
  token,
  groupId,
  pageId,
  userId,
}: {
  image: string;
  token: string;
  groupId?: string;
  pageId?: string;
  userId?: string;
}) => {
  try {
    const urlParams = new URLSearchParams();

    if (groupId) {
      urlParams.set("groupId", groupId);
    }

    if (pageId) {
      urlParams.set("pageId", pageId);
    }

    if (userId) {
      urlParams.set("userId", userId);
    }

    const res = await fetch(
      `${config.apiUrl}/api/upload/cover-photo?${urlParams.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image,
        }),
      }
    );

    if (!res.ok) {
      toast.error("Failed to update cover photo");
    }

    const response = await res.json();

    if (response.status === "success") {
      toast.success(response.message);
    } else {
      toast.error(response.message);
      return;
    }

    return response.data;
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

export const updateProfilePicture = async ({
  image,
  token,
  groupId,
  pageId,
  userId,
}: {
  image: string;
  token: string;
  groupId?: string;
  pageId?: string;
  userId?: string;
}) => {
  try {
    const urlParams = new URLSearchParams();

    if (groupId) {
      urlParams.set("groupId", groupId);
    }

    if (pageId) {
      urlParams.set("pageId", pageId);
    }

    if (userId) {
      urlParams.set("userId", userId);
    }

    const res = await fetch(
      `${config.apiUrl}/api/upload/profile-picture?${urlParams.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image,
        }),
      }
    );

    if (!res.ok) {
      toast.error("Failed to update cover photo");
    }

    const response = await res.json();

    if (response.status === "success") {
      toast.success(response.message);
    } else {
      toast.error(response.message);
      return;
    }

    return response.data;
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

export const getUserGroupsPosts = async ({ token }: { token: string }) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/groups/my-groups/posts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Failed to fetch groups posts");
    }

    const data = await response.json();

    if (data.status === "success") {
      return data.data.posts as Post[];
    } else {
      toast.error(data.message);
      return [];
    }
  } catch (error) {
    console.error(error);
  }
};
