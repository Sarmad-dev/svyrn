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

export const getCampaignsOverview = async ({ token }: { token: string }) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/analytics/overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaigns overview');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching campaigns overview:', error);
    throw error;
  }
};

// Ad Set actions
export const createAdSet = async <T>({
  token,
  campaignId,
  data,
}: {
  token: string;
  campaignId: string;
  data: T;
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/campaigns/${campaignId}/ad-sets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();

    if (!res.ok || response.status !== "success") {
      toast.error(response?.message || "Failed to create ad set");
      throw new Error(response?.message || "Failed to create ad set");
    }

    toast.success(response.message || "Ad set created successfully");
    return response.data as { adSet: any; nextStep?: string };
  } catch (error) {
    console.error("Ad set creation error:", error);
    throw error;
  }
};

// Ad actions
export const createAd = async <T>({
  token,
  adSetId,
  data,
}: {
  token: string;
  adSetId: string;
  data: T;
}) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/campaigns/ad-sets/${adSetId}/ads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();

    if (!res.ok || response.status !== "success") {
      toast.error(response?.message || "Failed to create ad");
      throw new Error(response?.message || "Failed to create ad");
    }

    toast.success(response.message || "Ad created successfully");
    return response.data as { ad: any; nextStep?: string };
  } catch (error) {
    console.error("Ad creation error:", error);
    throw error;
  }
};

// Campaign management actions
export const getCampaign = async ({ token, id }: { token: string; id: string }) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/campaigns/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });

    const response = await res.json();
    if (!res.ok || response.status !== "success") {
      toast.error(response?.message || "Failed to get campaign");
      throw new Error(response?.message || "Failed to get campaign");
    }

    return response.data.campaign as any;
  } catch (error) {
    console.error("Get campaign error:", error);
    throw error;
  }
};

export const deleteCampaign = async ({ token, id }: { token: string; id: string }) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/campaigns/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await res.json();
    if (!res.ok || response.status !== "success") {
      toast.error(response?.message || "Failed to delete campaign");
      throw new Error(response?.message || "Failed to delete campaign");
    }

    toast.success(response.message || "Campaign deleted successfully");
    return response.data;
  } catch (error) {
    console.error("Delete campaign error:", error);
    throw error;
  }
};

export const getCampaignAdSets = async ({ token, campaignId }: { token: string; campaignId: string }) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/campaigns/${campaignId}/ad-sets`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });

    const response = await res.json();
    if (!res.ok || response.status !== "success") {
      toast.error(response?.message || "Failed to get ad sets");
      throw new Error(response?.message || "Failed to get ad sets");
    }

    return response.data.adSets as any[];
  } catch (error) {
    console.error("Get ad sets error:", error);
    throw error;
  }
};

export const getAdSetAds = async ({ token, adSetId }: { token: string; adSetId: string }) => {
  try {
    const res = await fetch(`${config.apiUrl}/api/campaigns/ad-sets/${adSetId}/ads`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });

    const response = await res.json();
    if (!res.ok || response.status !== "success") {
      toast.error(response?.message || "Failed to get ads");
      throw new Error(response?.message || "Failed to get ads");
    }

    return response.data.ads as any[];
  } catch (error) {
    console.error("Get ads error:", error);
    throw error;
  }
};


