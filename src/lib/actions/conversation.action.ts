import { toast } from "sonner";
import { config } from "../config";
import { Message } from "@/types/global";

export const createConversation = async ({
  token,
  data,
}: {
  token: string;
  data: {
    type: string;
    participants: string[];
    name: string;
    description: string;
  };
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/conversations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      toast.error("Failed to create conversation");
    }

    const response = await res.json();

    if (response.status === "success") {
      toast.success(response.message);
      return response.data.conversation;
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getConversations = async ({
  token,
  type = "direct",
  page = 1,
  limit = 20,
}: {
  token: string;
  type?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const res = await fetch(
      `${config.apiUrl}/api/conversations?type=${type}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      toast.error("Failed to get conversations");
      return;
    }

    const response = await res.json();

    if (response.status === "success") {
      return {
        conversations: response.data.conversations,
        pagination: response.data.pagination,
      };
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
    toast.error("Unexpected error occurred");
  }
};

export const getConversation = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/conversations/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      toast.error("Failed to get conversation");
      return;
    }

    const response = await res.json();

    if (response.status === "success") {
      return response.data.conversation;
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    console.error("Error fetching conversation:", error);
    toast.error("Unexpected error occurred");
  }
};

export const getMessages = async ({
  token,
  conversationId,
}: {
  token: string;
  conversationId: string;
}) => {
  try {
    const res = await fetch(
      `${config.apiUrl}/api/conversations/${conversationId}/messages`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      toast.error("Failed to get messages");
      return;
    }

    const response = await res.json();

    if (response.status === "success") {
      return response.data.messages as Message[];
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    toast.error("Unexpected error occurred");
  }
};

export const sendMessage = async ({
  token,
  content,
  conversationId,
}: {
  token: string;
  content: string;
  conversationId: string;
}) => {
  try {
    const res = await fetch(
      `${config.apiUrl}/api/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!res.ok) {
      toast.error("Failed to send message");
    }

    const response = await res.json();

    if (response.status === "success") {
      toast.success(response.message);
      return response.data.message;
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    console.log(error);
  }
};
