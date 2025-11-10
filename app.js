

import express from "express";
import authRouter from "./controllers/auth.js";

const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json());



  app.use("/api", authRouter);


  

  return app;
};

export default createApp;