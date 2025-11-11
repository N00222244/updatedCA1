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
            minl: 1000,
            maxl: 9999,
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
        }

    }
)


noteSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

export default mongoose.model("Car", carSchema);