import express from "express"
import User from "../models/user.js";

import {
    HttpError,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    TEAPOT } from "../utils/HttpError.js";

import { validate } from "../middleware/validateRequest.js";
import { loginSchema, registerSchema } from "../utils/validators.js";




const router = express.Router();

//post request to the /register endpoint
router.post("/register", validate(registerSchema),async (req, res)=>{
    
    
    const {name, email, password, phone } = req.body;


    // this checks the data base to see if there alredy exists an account with this email
    // if so it returns error w messge.
    const exists = await User.findOne({email});
    if(exists){
        throw new HttpError(BAD_REQUEST, "This email is already registered with another account.")
    }

    //hashing the password and then storing the users details within the database using userCreate method
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
        name,
        email,
        passwordHash,
        phone,
    });

    

    res.status(201).json({
    message: "User created successfully",
    user, });
});

    // User login
router.post("/login",  validate(loginSchema),async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(UNAUTHORIZED, "Invalid credentials");
  }

  // Verify password
  const passwordCorrect = await user.verifyPassword(password);
  if (!passwordCorrect) {
    throw new HttpError(UNAUTHORIZED, "Invalid credentials");
  }

  // Set session
  req.session.userId = user._id.toString();

  res.status(200).json({
    message: "Login successful",
    user,
  });
});


router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw new HttpError(INTERNAL_SERVER_ERROR, "Log out unsuccesful");
    }
    res.clearCookie("sessionId"); // Clear the session cookie
    res.status(200).json({ message: "Logout successful" });
  });
});


router.get("/me", async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    throw new HttpError(UNAUTHORIZED, "Not logged in");
  }

  const user = await User.findById(userId).select("name email phone"); 
  if (!user) {
    throw new HttpError(NOT_FOUND, "User not found");
  }

  res.status(200).json({ user });
});


export default router;