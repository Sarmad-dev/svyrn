import { toast } from "sonner";
import { config } from "../config";

interface MediaItem {
  url: string;
  caption: string;
}

export const createStory = async ({
  token,
  mediaItems,
  privacy = "friends",
}: {
  token: string;
  mediaItems: MediaItem[];
  privacy?: "public" | "friends" | "close_friends";
}) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/stories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mediaItems,
        privacy,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to create story");
      throw new Error(errorData.message || "Failed to create story");
    }

    const data = await response.json();
    if (data.status === "success") {
      toast.success("Story created successfully!");
      return data.data.story;
    } else {
      toast.error(data.message || "Failed to create story");
      throw new Error(data.message || "Failed to create story");
    }
  } catch (error) {
    console.error("Error creating story:", error);
    throw error;
  }
};

export const getTImelineStories = async ({ token }: { token: string }) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/stories/timeline`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch timeline stories");
    }

    const data = await response.json();
    if (data.status === "success") {
      return data.data.stories;
    } else {
      toast.error("Failed to fetch timeline stories");
    }
  } catch (error) {
    console.error("Error fetching timeline stories:", error);
    throw error;
  }
};
