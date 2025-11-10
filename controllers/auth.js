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




const router = express.Router();

//post request to the /register endpoint
router.post("/register", async (req, res)=>{
    
    
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


export default router;