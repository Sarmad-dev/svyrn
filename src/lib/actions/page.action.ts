import z from "zod";
import { createPageSchema } from "../validations";
import { toast } from "sonner";
import { config } from "../config";

export const createPage = async ({
  token,
  data,
}: {
  token: string;
  data: z.infer<typeof createPageSchema>;
}) => {
  try {
    const response = await fetch(`${config.apiUrl}/api/pages`, {
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
    } else {
      toast.error(res.message);
    }
  } catch (error) {
    console.log(error);
  }
};
