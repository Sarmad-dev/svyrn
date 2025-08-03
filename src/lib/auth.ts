import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { SignJWT } from "jose";
import { connectDB } from "./db";

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

async function createCustomToken(sessionId: string, userId: string) {
  return new SignJWT({ sessionId, userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

const mongooseConnection = await connectDB();

export const auth = betterAuth({
  database: mongodbAdapter(mongooseConnection!),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    modelName: "users",
  },
  session: {
    modelName: "usersessions",
    collectionName: "usersessions",
  },
  databaseHooks: {
    session: {
      create: {
        async before(session) {
          const token = await createCustomToken(session.id, session.userId);
          return {
            data: {
              ...session,
              token: token,
            },
          };
        },
      },
    },
  },
});
