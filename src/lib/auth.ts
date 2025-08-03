import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { SignJWT } from "jose";
import clientPromise from "./db";

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

async function createCustomToken(sessionId: string, userId: string) {
  return new SignJWT({ sessionId, userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

const client = await clientPromise;

export const auth = betterAuth({
  database: mongodbAdapter(client.db("social-network")),
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
        after: async (session, context) => {
          context?.setCookie("token", session.token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
          });
        },
      },
    },
  },
});
