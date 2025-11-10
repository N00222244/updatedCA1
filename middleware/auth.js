import session from "express-session";
import MongoStore from "connect-mongo";
import User from "../models/user.js";
import { UNAUTHORIZED, FORBIDDEN, HttpError } from "../utils/HttpError.js";
import mongoose from "mongoose";



//defining the session middleware 
export const sessionMiddleware = () =>
  session({
    secret: process.env.SESSION_SECRET,
    name: "sessionId",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
    },
  });

  // Middleware to check if user is authenticated
export const requireAuth = async (req, _res, next) => {
  if (!req.session || !req.session.userId) {
    throw new HttpError(UNAUTHORIZED, "Authentication required");
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    throw new HttpError(UNAUTHORIZED, "User not found");
  }

  req.user = user; // Attach user to request for use in route handlers
  next();
};

// Middleware to check if user has a specific role
export const requireRole = (...roles) => {
  return async (req, _res, next) => {
    if (!req.session || !req.session.userId) {
      throw new HttpError(UNAUTHORIZED, "Authentication required");
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      throw new HttpError(UNAUTHORIZED, "User not found");
    }

    if (!roles.includes(user.role)) {
      throw new HttpError(FORBIDDEN, "Forbidden: Insufficient permissions");
    }

    // Attach user to request for use in route handlers
    req.user = user;
    next();
  };
};


export const requireAdmin = requireRole("admin");