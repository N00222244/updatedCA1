

import express from "express";
import authRouter from "./controllers/auth.js";
import adminRouter from "./controllers/admin.js";

import {requireAdmin,sessionMiddleware } from "./middleware/auth.js";

const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);

  app.use(express.json());

  app.use(sessionMiddleware());



  app.use("/api", authRouter);
  app.use("/api/admin", requireAdmin, adminRouter);


  

  return app;
};

export default createApp;