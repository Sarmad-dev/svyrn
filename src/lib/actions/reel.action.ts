import { Reel, ReelComment } from "@/types/global";
import { config } from "../config";
import { toast } from "sonner";

// Types for API requests
interface CreateReelRequest {
  mediaUrl: string;
  mediaType: "image" | "video";
  caption?: string;
  audioInfo?: string;
  privacy?: "public" | "friends" | "private" | "followers";
  location?: string;
  tags?: string[];
  hashtags?: string[];
  mentions?: string[];
}

interface GetReelsRequest {
  cursor?: string;
  limit?: number;
  privacy?: string;
  category?: string;
}

interface ToggleReactionRequest {
  reelId: string;
  reactionType: "like" | "love" | "haha" | "wow" | "sad" | "angry";
}

interface CreateCommentRequest {
  reelId: string;
  content: string;
  parentCommentId?: string;
}

// Create a new reel
export async function createReel(
  token: string,
  data: CreateReelRequest
): Promise<Reel> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create reel");
  }

  return response.json();
}

// Get trending reels
export async function getTrendingReels(
  token: string,
  request: GetReelsRequest = {}
): Promise<{
  reels: Reel[];
  pagination: {
    hasNextPage: boolean;
    nextCursor?: string;
  };
}> {
  const params = new URLSearchParams();
  if (request.cursor) params.append("cursor", request.cursor);
  if (request.limit) params.append("limit", request.limit.toString());
  if (request.privacy) params.append("privacy", request.privacy);
  if (request.category) params.append("category", request.category);

  const response = await fetch(`${config.apiUrl}/api/reels`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch trending reels");
  }

  const data = await response.json();

  return data.data;
}

// Get user feed reels
export async function getUserFeedReels(
  token: string,
  request: GetReelsRequest = {}
): Promise<{
  reels: Reel[];
  pagination: {
    hasNextPage: boolean;
    nextCursor?: string;
  };
}> {
  const params = new URLSearchParams();
  if (request.cursor) params.append("cursor", request.cursor);
  if (request.limit) params.append("limit", request.limit.toString());

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reels/feed?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user feed reels");
  }

  return response.json();
}

// Get a specific reel by ID
export async function getReelById(
  token: string,
  reelId: string
): Promise<Reel> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reels/${reelId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch reel");
  }

  return response.json();
}

// Toggle reaction on a reel
export async function toggleReelReaction(
  token: string,
  data: ToggleReactionRequest
): Promise<{
  success: boolean;
  reactionType?: string;
  totalReactions: number;
}> {
  const response = await fetch(
    `${config.apiUrl}/api/reels/${data.reelId}/reactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reactionType: data.reactionType }),
    }
  );

  if (!response.ok) {
    toast.error("Failed to toggle reaction");
  }

  const result = await response.json();

  if (result.success) {
    toast.success(result.message);
    return result.data;
  } else {
    toast.error(result.message);
    return {
      success: false,
      reactionType: "",
      totalReactions: 0,
    };
  }
}

// Save/unsave a reel
export async function toggleSaveReel(
  token: string,
  reelId: string
): Promise<{
  success: boolean;
  isSaved: boolean;
}> {
  const response = await fetch(
    `${config.apiUrl}/api/reels/${reelId}/save`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    toast.error("Failed to toggle save");
    return {
      success: false,
      isSaved: false,
    };
  }

  const result = await response.json();

  if (result.success) {
    toast.success(result.message);
    return result.data;
  } else {
    toast.error(result.message);
    return {
      success: false,
      isSaved: false,
    };
  }
}

// Share a reel
export async function shareReel(
  token: string,
  reelId: string,
  platform?: string
): Promise<{
  success: boolean;
  shareUrl?: string;
}> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reels/${reelId}/share`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ platform }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to share reel");
  }

  return response.json();
}

// Get comments for a reel
export async function getReelComments(
  token: string,
  reelId: string,
  request: {
    cursor?: string;
    limit?: number;
  } = {}
): Promise<{
  comments: ReelComment[];
  pagination: {
    hasNextPage: boolean;
    nextCursor?: string;
  };
}> {
  const params = new URLSearchParams();
  if (request.cursor) params.append("cursor", request.cursor);
  if (request.limit) params.append("limit", request.limit.toString());

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reels/${reelId}/comments?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch comments");
  }

  const result = await response.json();

  // Handle the backend response structure
  if (result.success && result.data) {
    return result.data;
  }

  // Fallback to direct response if structure is different
  return result;
}

// Create a comment on a reel
export async function createReelComment(
  token: string,
  data: CreateCommentRequest
): Promise<ReelComment> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reels/${data.reelId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: data.content,
        parentCommentId: data.parentCommentId,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create comment");
  }

  const result = await response.json();

  // Handle the backend response structure
  if (result.success && result.data) {
    return result.data;
  }

  // Fallback to direct response if structure is different
  return result;
}

// Toggle reaction on a comment
export async function toggleCommentReaction(
  token: string,
  commentId: string,
  reactionType: string
): Promise<{
  success: boolean;
  reactionType?: string;
  totalReactions: number;
}> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reels/comments/${commentId}/reactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reactionType }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to toggle comment reaction");
  }

  const result = await response.json();

  // Handle the backend response structure
  if (result.success && result.data) {
    return result.data;
  }

  // Fallback to direct response if structure is different
  return result;
}

// Get saved reels
export async function getSavedReels(
  token: string,
  request: GetReelsRequest = {}
): Promise<{
  reels: Reel[];
  pagination: {
    hasNextPage: boolean;
    nextCursor?: string;
  };
}> {
  const params = new URLSearchParams();
  if (request.cursor) params.append("cursor", request.cursor);
  if (request.limit) params.append("limit", request.limit.toString());

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reels/saved?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch saved reels");
  }

  return response.json();
}

// Get user's own reels
export async function getUserReels(
  token: string,
  userId: string,
  request: GetReelsRequest = {}
): Promise<{
  reels: Reel[];
  pagination: {
    hasNextPage: boolean;
    nextCursor?: string;
  };
}> {
  const params = new URLSearchParams();
  if (request.cursor) params.append("cursor", request.cursor);
  if (request.limit) params.append("limit", request.limit.toString());
  if (request.privacy) params.append("privacy", request.privacy);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reels/user/${userId}?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user reels");
  }

  return response.json();
}
