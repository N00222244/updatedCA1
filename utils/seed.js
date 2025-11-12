import User from "../models/user.js";
import Dealership from "../models/dealership.js";
import Brand from "../models/brand.js";
import Car from "../models/car.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


mongoose.connect(process.env.MONGODB_URI).then(async () => {
  // Delete any already existing data
  await Dealership.deleteMany({}).exec();
  await User.deleteMany({}).exec();
  await Brand.deleteMany({}).exec();
  await Car.deleteMany({}).exec();

  //Create 3 different users with a differnt role


  const admin = await User.create({
    name: "admin1",
    email: "admin@gmail.com",
    passwordHash: await User.hashPassword("Password12345"),
    role: "admin",
    phone: "123456678"
  });

  console.log("Admin Seeded:", admin.email );

  const user = await User.create({
    name: "user1",
    email: "user@gmail.com",
    passwordHash: await User.hashPassword("Password12345"),
    role: "user",
    phone: "123456678"
  });

  console.log("User Seeded:", user.email );

  const manager = await User.create({
    name: "manager1",
    email: "manager@gmail.com",
    passwordHash: await User.hashPassword("Password12345"),
    role: "manager",
    phone: "123456678"
  });

  console.log("Manager Seeded:", manager.email );


  // Seeding Brands


  const toyota = await Brand.create({
    brandName: "Toyota",
    yearEstablished: 1937,
    logoUrl: "https://toyota.com/logo.png",
    website: "https://www.toyota.com",
    country: "Japan",
    description: "Reliable and innovative cars",
  });


  const ford = await Brand.create({
    brandName: "Ford",
    yearEstablished: 1903,
    logoUrl: "https://ford.com/logo.png",
    website: "https://www.ford.com",
    country: "USA",
    description: "American car manufacturer",
  });

  const bmw = await Brand.create({
    brandName: "BMW",
    yearEstablished: 1902,
    logoUrl: "https://bmw.com/logo.png",
    website: "https://www.bmw.com",
    country: "USA",
    description: "German car manufacturer",
  });


  console.log("Brands seeded:", ford.name, ", " ,toyota.name, ", " ,bmw.name);

  // seeding dealerships

  const dealership1 = await Dealership.create({
        dealershipName: "Wicklow Motors",
        location: "Wicklow",
        phone: "87934521",
        brands: [toyota._id, ford._id],
        manager: manager._id,
    });
  const dealership2 = await Dealership.create({
        dealershipName: "Dublin Motors",
        location: "Dublin",
        phone: "87934521",
        brands: [toyota._id, ford._id],
        manager: manager._id,
    });  


    console.log("Added Dealerships:",  dealership1.name, ", " ,dealership2.name)



   await Car.create({
        modelName: "Corolla",
        year: 2022,
        price: 25000,
        engineSize: 1.8,
        mileage: 0,
        description: "Compact sedan",
        extras: ["Air conditioning", "Bluetooth"],
        brand: toyota._id,
  });

  await Car.create({
    modelName: "Mustang",
    year: 2023,
    price: 55000,
    engineSize: 5.0,
    mileage: 0,
    description: "Sports car",
    extras: ["Leather seats", "Navigation"],
    brand: ford._id,
  });


  await Car.create({
    modelName: "Corolla",
    year: 2022,
    price: 25000,
    engineSize: 1.8,
    mileage: 0,
    description: "Compact sedan",
    extras: ["Air conditioning", "Bluetooth"],
    brand: toyota._id,
  });

  await Car.create({
    modelName: "M3 Compettiton",
    year: 2023,
    price: 100000,
    engineSize: 5.0 ,
    mileage: 0,
    description: "Competition car",
    extras: ["Leather seats", "Navigation", "IDrive"],
    brand: ford._id,
  });

    mongoose.connection.close();
  console.log("Seeding complete, connection closed");
  
});