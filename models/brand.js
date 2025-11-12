import mongoose from "mongoose";


const brandSchema = new mongoose.Schema(
    {
        brandName: {
            type: String,
            minlength: 2,
            required: true,
        },
        yearEstablished: {
            type: Number,
            min: 1810, // Peugeot is the oldest car brand in the world -> cool to know
            max: 2025,
            required: true,
        },
        logoUrl: {
            type: String, //stored as a stringiified url for aws bucket later
            required: true,
        },
        website: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        
    }
);


brandSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

export default mongoose.model("Brand", brandSchema);