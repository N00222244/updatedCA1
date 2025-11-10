
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import createApp from './app.js';







const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};


// app.get("/", (req, res) => {
//   res.send("Hello! Your server is working");
// });

const PORT = process.env.PORT || 3001;
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected");
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();