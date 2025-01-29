import { config } from "dotenv";
config();

import mongoose from "mongoose";

console.log("MONGO_URI from connectDB:", process.env.MONGO_URI);
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};