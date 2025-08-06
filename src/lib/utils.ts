import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { authClient } from "./auth-client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formateDate = (date: string | Date) => {
  return formatDistanceToNow(parseISO(date as string), { addSuffix: true });
};

/**
 * Converts an ISO string to a human-readable format.
 * @param isoString ISO 8601 formatted date string
 * @returns Formatted string like "Jul 30, 2025 5:08 PM"
 */

export function formatDateBeautiful(isoString: string): string {
  try {
    const date = parseISO(isoString);
    return format(date, "MMM d, yyyy h:mm a");
  } catch (error) {
    console.error("Invalid date:", error);
    return "";
  }
}

export const getLocation = (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return value.toString();
}

export const getToken = async ({ headers }: { headers: Headers }) => {
  const { data } = await authClient.getSession({}, { headers: headers });

  return data?.session.token;
};

