import mongoose from "mongoose";


const carSchema = new mongoose.Schema(
    {
        modelName: {
            type: String,
            minlength: 5,
            required: true,
        },
        year: {
            type: Number,
            min: 1900,
            max: 2025,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        engineSize: {
            type: Number,
            required: true,
            min: 0.5,
            max: 10.0,
        },
        mileage: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        extras: {
            type: [String],
            required: false,
        },
        brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand", // reference to the Brand
        required: true
        },

    }
);


carSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

export default mongoose.model("Car", carSchema);