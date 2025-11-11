

import express from "express";
import authRouter from "./controllers/auth.js";
import adminRouter from "./controllers/admin.js";
import carsRouter from "./controllers/car.js";

import {requireAdmin,sessionMiddleware } from "./middleware/auth.js";


const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);

  app.use(express.json());

  app.use(sessionMiddleware());



  app.use("/api", authRouter);
  app.use("/api/admin", requireAdmin, adminRouter);
  app.use("/api/car", carsRouter);


  

  return app;
};

export default createApp;