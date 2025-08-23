import { toast } from "sonner";
import { config } from "../config";

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    isVerified?: boolean;
  };
  recipient: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const getNotifications = async ({
  token,
  limit = 10,
  page = 1,
  unreadOnly = false,
}: {
  token: string;
  limit?: number;
  page?: number;
  unreadOnly?: boolean;
}) => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
      unreadOnly: unreadOnly.toString(),
    });

    const response = await fetch(
      `${config.apiUrl}/api/notifications?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Failed to fetch notifications");
      return;
    }

    const res = await response.json();

    if (res.status === "success") {
      return {
        notifications: res.data.notifications as Notification[],
        unreadCount: res.data.unreadCount,
        pagination: res.data.pagination,
      };
    } else {
      toast.error(res.message);
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    toast.error("Unexpected error occurred");
  }
};

export const markNotificationAsRead = async ({
  token,
  notificationId,
}: {
  token: string;
  notificationId: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/notifications/${notificationId}/read`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Failed to mark notification as read");
      return;
    }

    const res = await response.json();

    if (res.status === "success") {
      return res.data.notification;
    } else {
      toast.error(res.message);
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    toast.error("Unexpected error occurred");
  }
};

export const markAllNotificationsAsRead = async ({
  token,
}: {
  token: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/notifications/read-all`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Failed to mark all notifications as read");
      return;
    }

    const res = await response.json();

    if (res.status === "success") {
      toast.success("All notifications marked as read");
      return res.data;
    } else {
      toast.error(res.message);
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    toast.error("Unexpected error occurred");
  }
};
