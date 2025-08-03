import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI, {
    dbName: "social-network",
  });

  return mongoose.connection.db;
};
