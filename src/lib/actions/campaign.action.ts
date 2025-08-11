/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { config } from "../config";

type CreateCampaignArgs<T> = {
  token: string;
  data: T;
};

export const createCampaign = async <T>({ token, data }: CreateCampaignArgs<T>) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();

    if (!res.ok || response.status !== "success") {
      toast.error(response?.message || "Failed to create campaign");
      throw new Error(response?.message || "Failed to create campaign");
    }

    toast.success(response.message || "Campaign created successfully");
    return response.data as { campaign: any; totalCost: number; nextStep?: string };
  } catch (error) {
    console.error("Campaign creation error:", error);
    throw error;
  }
};

export const processCampaignPayment = async ({
  token,
  campaignId,
  paymentMethodId,
}: {
  token: string;
  campaignId: string;
  paymentMethodId: string;
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/campaigns/${campaignId}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentMethodId }),
    });

    const response = await res.json();

    if (!res.ok || response.status !== "success") {
      toast.error(response?.message || "Payment failed");
      throw new Error(response?.message || "Payment failed");
    }

    return response.data as {
      paymentIntent: { id: string; status: string; client_secret?: string };
      campaign: { id: string; status: string; paymentStatus: string };
    };
  } catch (error) {
    console.error("Payment error:", error);
    throw error;
  }
};

export const getCampaigns = async ({ token }: { token: string }) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/campaigns`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });

    const response = await res.json();
    if (!res.ok || response.status !== "success") {
      toast.error(response?.message || "Failed to get campaigns");
      throw new Error(response?.message || "Failed to get campaigns");
    }

    return response.data.campaigns as any[];
  } catch (error) {
    console.error("Get campaigns error:", error);
    throw error;
  }
};

export const getCampaignAnalytics = async ({
  token,
  id,
  dateRange = "7d",
}: {
  token: string;
  id: string;
  dateRange?: "1d" | "7d" | "30d";
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/campaigns/${id}/analytics?dateRange=${dateRange}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });

    const response = await res.json();
    if (!res.ok || response.status !== "success") {
      toast.error(response?.message || "Failed to get analytics");
      throw new Error(response?.message || "Failed to get analytics");
    }

    return response.data;
  } catch (error) {
    console.error("Get analytics error:", error);
    throw error;
  }
};


