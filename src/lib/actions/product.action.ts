import { toast } from "sonner";
import { config } from "../config";

export const createProduct = async ({
  token,
  data,
}: {
  token: string;
  data: {
    title: string;
    price: { amount: number };
    description: string;
    privacy: "friends" | "public";
    images: string[];
    location?: {
      address: string;
      city: string;
      state: string;
      country: string;
      coordinates?: { latitude: number; longitude: number };
    };
    contact: {
      email: string;
      phone: string;
    };
  };
}) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/marketplace/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      toast.error("Something went wrong");
    }

    const res = await response.json();

    if (res.status === "success") {
      toast.success(res.message);
      return res.data.product;
    } else {
      toast.error(res.message);
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async ({
  token,
  search,
  location,
  page = 1,
  limit = 12,
}: {
  search?: string;
  location?: string;
  token: string;
  page?: number;
  limit?: number;
}) => {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append('search', search);
    }

    if (location) {
      params.append('location', location);
    }

    const response = await fetch(
      `${config.apiUrl}/api/marketplace/products?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      toast.error("Something went wrong");
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const res = await response.json();

    if (res.status === "success") {
      return {
        products: res.data.products,
        pagination: res.data.pagination,
      };
    } else {
      toast.error(res.message);
      throw new Error(res.message);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProduct = async ({
  token,
  id,
}: {
  token: string;
  id: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/marketplace/products/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Something went wrong");
    }
    const res = await response.json();

    if (res.status === "success") {
      return res.data;
    } else {
      toast.error(res.message);
    }
  } catch (error) {
    console.log(error);
  }
};

export const addReviewToProduct = async ({
  token,
  productId,
  review,
}: {
  token: string;
  productId: string;
  review: {
    rating: number;
    comment: string;
  };
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/marketplace/products/${productId}/review`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(review),
      }
    );

    if (!response.ok) {
      toast.error("Something went wrong");
    }

    const res = await response.json();

    if (res.status === "success") {
      toast.success(res.message);
      return res.data;
    } else {
      toast.error(res.message);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUserProducts = async ({
  token,
  userId,
  search,
}: {
  token: string;
  userId: string;
  search: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/marketplace/products/user/${userId}?search=${search}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Something went wrong");
    }

    const res = await response.json();

    if (res.status === "success") {
      return res.data.products;
    } else {
      toast.error(res.message);
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async <T>({
  token,
  data,
  productId,
}: {
  token: string;
  data: T;
  productId: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/marketplace/products/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      toast.error("Something went wrong");
    }

    const res = await response.json();

    if (res.status === "success") {
      toast.success(res.message);
      return res.data.product;
    } else {
      toast.error(res.message);
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async ({
  token,
  productId,
}: {
  token: string;
  productId: string;
}) => {
  try {
    const response = await fetch(
      `${config.apiUrl}/api/marketplace/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Something went wrong");
    }

    const res = await response.json();

    if (res.status === "success") {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  } catch (error) {
    console.log(error);
  }
};
