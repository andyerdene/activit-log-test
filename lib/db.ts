import mongoose from "mongoose";

export const connection = {
  isConnected: 0,
};

export async function connectDatabase() {
  const DATABASE_URL = process.env.MONGODB_URL!;

  if (connection.isConnected > 0) {
    return;
  }

  try {
    const dbConnection = await mongoose.connect(DATABASE_URL);
    connection.isConnected = dbConnection.connections[0].readyState;
    console.log("Database connected successfully");
    console.log("Connection state:", connection.isConnected);
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to database");
  }
}
