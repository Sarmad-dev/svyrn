import { config } from "../config";

export const getSession = async () => {
  try {
    const res = await fetch(`${config.apiUrl}/api/me`);

    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
};
