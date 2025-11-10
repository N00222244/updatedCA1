import { Router } from "express";
import User from "../models/user.js";

const adminRouter = Router();

// Get all users
adminRouter.get("/users", async (_req, res) => {
  const users = await User.find().exec();
  res.json(users);
});

export default adminRouter;