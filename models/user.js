import mongoose from "mongoose";
import bcrypt from "bcrypt";



//defining the user schema, the user object contaiains the fields:
//Name, Email, Password, Phone number and their Role.
//Role defaults to user as most users for this will be ordinary users, other roles willl entail escaleted privelages on the server,
//Editor will be able to edit certain entities details and remove some where as admin will have full crud abilities across the site.

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        minlength: 2,
        required: true,
    },

    email:{
        type: String,
        minlength: 4,
        required: true,
    },

    passwordHash:{
        type: String,
        minlength: 5,
        required: true,
    },
    
    phone:{
        type: "String",
        minlength: 6,
        required: "false",
    },

    role:{
        type: String,
        enum: ["user", "manager" ,"admin" ],
        default: "user",
        required: true,
    }

    
},{
    timestamps:true,
}

);


// comverting the schema to json and removing certain sensetive fiels such as the object creation/update time records,
// mongooses versioning, object id and of course the password.

userSchema.set("toJSON", {

    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash; 
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    }

})


// statically hashinging the pass word with bcrypte and adding 10 different saltrounds to add more uniquness to the hashed password.
userSchema.statics.hashPassword = async function (password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};



//this instance  method is used to verify that the password is correct  it uses bcrypts built in compare method to 
//compare the password vs the passwordhash.
userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};







const User = mongoose.model("User", userSchema);
export default User;