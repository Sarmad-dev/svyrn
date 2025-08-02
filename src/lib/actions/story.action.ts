import { toast } from "sonner";
import { config } from "../config";

export const createStory = async ({
  token,
  content: { caption, url },
  privacy = "public",
}: {
  token: string;
  content: {
    caption: string;
    url: string;
  };
  privacy?: "public" | "friends";
}) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/stories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: {
          caption,
          url,
        },
        privacy,
      }),
    });

    console.log("Response from createStory:", response);

    if (!response.ok) {
      toast.error("Failed to create story");
    }

    const data = await response.json();
    if (data.status === "success") {
      return data.story;
    } else {
      toast.error("Failed to create story");
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
