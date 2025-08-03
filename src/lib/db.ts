import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!, {
    dbName: "social-network",
  });

  return mongoose.connection.db;
};
