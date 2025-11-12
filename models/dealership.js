import mongoose from "mongoose";


const dealershipSchema = new mongoose.Schema(
    {
        dealershipName: {
            type: String,
            minlength: 5,
            required: true,
        },
        location: {
            type: String,
            required:true,
        },
        phone: {
            type: String, 
            required: true,
        },
        brands: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            
        }],
        manager: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }]
    }
);


dealershipSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});

export default mongoose.model("Dealership", dealershipSchema);