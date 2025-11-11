import mongoose from "mongoose";

export const registerSchema = {

  name: {
    in: ["body"],
    notEmpty:{
        errorMessage: "'Name' Field is required."
    }
  }, 
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'email' field is required",
    },
    isEmail: {
      errorMessage: "'email' field must be a valid email address",
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'password' field is required",
    },
    isStrongPassword: {
      options: {
        minLength: 8,
        minSymbols: 0,
        minUpperCase: 1,
        minNumbers: 1,
      },
      errorMessage:
        "'password' field must be 8 characters long, contain at least one upper case character and one number",
    },
  },

  phone: {
    in: ["body"],
    notEmpty: {
        errorMessage: "'phone' field is required"
    }
  }
};

export const loginSchema = {
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'email' field is required",
    },
    isEmail: {
      errorMessage: "'email' field must be a valid email address",
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "'password' field is required",
    },
    isString: {
      errorMessage: "'password' field must be a valid string",
    },
  },
};