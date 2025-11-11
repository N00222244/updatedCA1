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

export const carSchema = {
  modelName:{
    in: ["body"],
    notEmpty:{
      errorMessage: "Model Name is Required"
    }
  },

  year:{
    in: ["body"],
    notEmpty:{
      errorMessage: "Year is Required"
    },
    isInt: {
      options: { min: 1900, max: 2025 },
      errorMessage: "Year must be between 1900 and 2025"
    },
  },

  price:{
    in: ["body"],
    notEmpty:{
      errorMessage:"Year is Required"
    },
    isInt:{
      errorMessage: "Price must be Number"
    }
  },

  engineSize:{
    in: ["body"],
    notEmpty:{
      errorMessage:"Engine Size is Required"
    },
    isFloat:{
      options: { min: 0, max: 10 },
      errorMessage: "Engine Size must be between 0L and 10L "
    }
  },

  mileage: {
    in: ["body"],
    notEmpty:{
      errorMessage:"Mileage is Required"
    },
    isInt:{
      options: { min: 0, max: 999999 },
      errorMessage: "Mileage must be between 0 and 999999."
    }
  },
}

export const carIdSchema = {
  id: {
    in: ["params"],
    custom: {
      options: (value) => mongoose.Types.ObjectId.isValid(value),
      errorMessage: "Car ID 'id' parameter must be a valid ObjectId",
    },
  },
};