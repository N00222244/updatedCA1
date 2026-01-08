import session from "express-session";
import MongoStore from "connect-mongo";
import User from "../models/user.js";
import { UNAUTHORIZED, FORBIDDEN, HttpError, NOT_FOUND } from "../utils/HttpError.js";
import mongoose from "mongoose";
import Dealership from "../models/dealership.js";



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
      secure: true, 
      sameSite: "none",
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
      throw new HttpError(NOT_FOUND, "User not found");
    }

    if (!roles.includes(user.role)) {
      throw new HttpError(FORBIDDEN, "Forbidden: Insufficient permissions");
    }

    // Attach user to request for use in route handlers
    req.user = user;
    next();
  };
};

export const requireAdminOrOwner = async (req, res, next) => {
  
  
  if (!req.session || !req.session.userId) {
      throw new HttpError(UNAUTHORIZED, "Authentication required");
    }
  
  const user = await User.findById(req.session.userId);

  if (!user) {
      throw new HttpError(NOT_FOUND, "User not found");
    }

  if (user.role === "admin") return next(); // Admin bypass

  
  const dealership = await Dealership.findById(req.params.dealershipId || req.params.id);

  if (!dealership) throw new HttpError(NOT_FOUND, "Dealership not found");

  
  if (dealership.manager.toString() === user._id.toString()) {
    return next();
  }

  throw new HttpError(FORBIDDEN, "You are not allowed to modify this dealership");
};


export const requireAdmin = requireRole("admin");

export const requireAdminOrManger = requireRole("admin", "manager");