import { Router } from "express";
import {validate} from "../middleware/validateRequest.js";
import Car from "../models/car.js";
import { HttpError, NOT_FOUND } from "../utils/HttpError.js";
import { carIdSchema, carSchema } from "../utils/validators.js";


// defining succes message when request is succesful but there is no content to preview 
const SUCCESS_NO_CONTENT = 204;

//defines carsRouter
const carsRouter = Router();

// defines endpoint that gets all cars from db, checks to make sure users session id 
carsRouter.get("/", async (req,res) => {
    const cars = await Car.find().exec();
    res.json(cars);
})


//defines endpoint that gets car by id
carsRouter.get("/:id", validate(carIdSchema), async (req, res) => {

  const car = await Car.findById(req.params.id).exec() 

  if (!car) {
    throw new HttpError(NOT_FOUND, "Could not find Car");
  }

  res.json(car);
});

//defines endpoint that creates car
carsRouter.post("/", validate(carSchema), async (req, res) => {
 
 const { modelName, year, price, engineSize, mileage, description, extras } = req.body;

   const car = await Car.create({
    modelName,
    year,
    price,
    engineSize,
    mileage,
    description,
    extras
  });
  
  res.json(car);
});


//defines endpoint that updates car

carsRouter.patch("/:id", validate(carIdSchema), async (req, res) => {
  const { id } = req.params;
  const { modelName, year, price, engineSize, mileage, description, extras } = req.body;

  const car = await Car.findByIdAndUpdate(
    id,
    { modelName, 
      year, 
      price, 
      engineSize, 
      mileage, 
      description, 
      extras 
    }).exec();

  if (!car) {
    throw new HttpError(NOT_FOUND, "Could not find car.");
  }

  res.json(car);
});

// defines endpoint that deletes car
carsRouter.delete("/:id", validate(carIdSchema), async (req, res) => {

  const result = await Car.findByIdAndDelete(req.params.id).exec();

  if (!result) {
    throw new HttpError(NOT_FOUND, "Could not find car");
  }

  res.status(SUCCESS_NO_CONTENT).end();
});


export default carsRouter;