import z from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
});

export const createPostSchema = z.object({
  text: z.string().min(3),
  base64: z.string().optional(),
  privacy: z.enum(["public", "friends", "private"]),
  pageId: z.string().optional(),
  groupId: z.string().optional(),
});

export const groupSettingsSchema = z.object({
  approveMembers: z.boolean().optional(),
  allowMemberPosts: z.boolean().optional(),
  allowMemberInvites: z.boolean().optional(),
});

export const editProfileSchema = z.object({
  name: z.string().min(3).optional(),
  bio: z.string().min(3).optional(),
  currentJob: z.string().min(3).optional(),
  location: z.string().min(3).optional(),
  website: z.string().min(3).optional(),
});

export const userInfoSchema = z.object({
  worksAt: z
    .string()
    .max(100, { message: "Works at cannot exceed 100 characters" })
    .optional(),
  livesIn: z
    .string()
    .max(100, { message: "Lives in cannot exceed 100 characters" })
    .optional(),
  From: z
    .string()
    .max(100, { message: "From cannot exceed 100 characters" })
    .optional(),
  martialStatus: z.enum([
    "single",
    "married",
    "engaged",
    "in a relationship",
    "complicated",
  ]),
});

export type UserInfoFormValues = z.infer<typeof userInfoSchema>;

export const createPageSchema = z.object({
  name: z.string().min(3, { message: "Name must be atleast 3 characters." }),
  category: z
    .string()
    .min(3, { message: "Category must be atleast 3 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be atleast 10 characters." })
    .optional(),
  privacy: z.enum(["public", "friends"]),
});

export const settingSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be atleast 3 characters." }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be atleast 3 characters." }),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.date(),
});
