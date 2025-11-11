import { Router } from "express";
import {validate} from "../middleware/validateRequest.js";
import Dealership from "../models/dealership.js";
import { HttpError, NOT_FOUND } from "../utils/HttpError.js";
import { dealershipIdSchema, dealershipSchema } from "../utils/validators.js";


// defining succes message when request is succesful but there is no content to preview 
const SUCCESS_NO_CONTENT = 204;

//defines carsRouter
const dealershipRouter = Router();

// defines endpoint that gets all dealership from db, checks to make sure users session id 
dealershipRouter.get("/", async (req,res) => {
    const dealership = await Dealership.find().exec();
    res.json(dealership);
})


//defines endpoint that gets dealership by id
dealershipRouter.get("/:id", validate(dealershipIdSchema), async (req, res) => {

  const dealership = await Dealership.findById(req.params.id).exec() 

  if (!dealership) {
    throw new HttpError(NOT_FOUND, "Could not find Dealership");
  }

  res.json(dealership);
});

//defines endpoint that creates dealership
dealershipRouter.post("/", validate(dealershipSchema), async (req, res) => {
 
 const { dealershipName, location, phone, } = req.body;

   const dealership = await Dealership.create({
    dealershipName,
    location,
    phone,
  });
  
  res.json(dealership);
});


//defines endpoint that updates dealership

dealershipRouter.patch("/:id", validate(dealershipIdSchema), async (req, res) => {
  const { id } = req.params;
  const { dealershipName, location, phone, } = req.body;

  const dealership = await Dealership.findByIdAndUpdate(
    id,
    { dealershipName,
    location,
    phone,
    
    }).exec();

  if (!dealership) {
    throw new HttpError(NOT_FOUND, "Could not find dealership.");
  }

  res.json(dealership);
});

// defines endpoint that deletes dealership
dealershipRouter.delete("/:id", validate(dealershipIdSchema), async (req, res) => {

  const result = await Dealership.findByIdAndDelete(req.params.id).exec();

  if (!result) {
    throw new HttpError(NOT_FOUND, "Could not find dealership");
  }

  res.status(SUCCESS_NO_CONTENT).end();
});


export default dealershipRouter;