import { betterAuth } from "better-auth";
import mongoose from "mongoose";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

async function createCustomToken(sessionId: string, userId: string) {
  return new SignJWT({ sessionId, userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

const connectDB = async () => {
  if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI, {
    dbName: "social-network",
  });
};

await connectDB();

if (!mongoose.connection.db) {
  throw new Error(
    "MongoDB not connected yet. Call this after mongoose.connect()"
  );
}

console.log("FRONTEND URL: ", process.env.FRONTEND_URL);

export const auth = betterAuth({
  database: mongodbAdapter(mongoose.connection.db),
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
