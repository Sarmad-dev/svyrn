import { toast } from "sonner";
import { config } from "../config";
import { authClient } from "../auth-client";

export const createAd = async <T>({
  token,
  data,
}: {
  token: string;
  data: T;
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/ads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      toast.error("Failed to create ad");
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Failed to create ad");
    }

    const response = await res.json();

    if (response.status === "success") {
      toast.success(response.message);
      return response.data?.ad;
    } else {
      toast.error(response.message);
      throw new Error(response.message);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAds = async ({ token }: { token: string }) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/ads`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      toast.error("Failed to get ads");
    }

    const response = await res.json();

    if (response.status === "success") {
      return response.data.ads;
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUserAds = async () => {
  try {
    const { data } = await authClient.getSession();
    if (!data) {
      return;
    }

    const token = data?.session?.token;
    const userId = data.user.id;

    const res = await fetch(`${config.apiUrl}/api/ads/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      toast.error("Failed to get ads");
    }

    const response = await res.json();

    if (response.status === "success") {
      return response.data.ads;
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    console.log(error);
  }
};
