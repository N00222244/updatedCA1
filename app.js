

import express from "express";
import authRouter from "./controllers/auth.js";
import adminRouter from "./controllers/admin.js";
import carsRouter from "./controllers/car.js";
import brandRouter from "./controllers/brand.js";
import {requireAdmin,requireAuth,sessionMiddleware } from "./middleware/auth.js";
import dealershipRouter from "./controllers/dealership.js";
import helmet from "helmet";



const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);

  app.use(express.json());

  app.use(helmet());

  app.use(sessionMiddleware());



  app.use("/api", authRouter);
  app.use("/api/admin", requireAdmin, adminRouter);
  app.use("/api/car", requireAuth , carsRouter);
  app.use("/api/brand", requireAuth, brandRouter);
  app.use("/api/dealership", requireAuth, dealershipRouter);


  

  return app;
};

export default createApp;