import mongoose from "mongoose";
import bycrypt from "bycrypt";

const userSchema = new mongoose.Schema({
    Name:{
        type: String,
        minlength: 5,
        required: true,
    },

    Email:{
        type: String,
        minlength: 4,
        required: true,
    },

    Password:{
        type: String,
        required: true,
    },
    
    Phone:{
        type: "String",
        required: "false",
    },

    Role:{
        type: String,
        enum: ["user", "editor" ,"admin" ],
        default: "user",
        required: true,
    }
})
