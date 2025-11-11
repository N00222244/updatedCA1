import { Router } from "express";
import {validate} from "../middleware/validateRequest.js";
import Brand from "../models/brand.js";
import { HttpError, NOT_FOUND } from "../utils/HttpError.js";
import Dealership from "../models/dealership.js";
import { brandIdSchema, brandSchema } from "../utils/validators.js";


// defining succes message when request is succesful but there is no content to preview 
const SUCCESS_NO_CONTENT = 204;

//defines carsRouter
const brandRouter = Router();

// defines endpoint that gets all brand from db, checks to make sure users session id 
brandRouter.get("/", async (req,res) => {
    const brand = await Brand.find().exec();
    res.json(brand);
})


//defines endpoint that gets brand by id
brandRouter.get("/:id", validate(brandIdSchema), async (req, res) => {

  const brand = await Brand.findById(req.params.id).exec() 

  if (!brand) {
    throw new HttpError(NOT_FOUND, "Could not find Brand");
  }
  //getting dealerships that have this brand
  const dealerships = await Dealership.find({ brands: brand._id }).exec();

  //returning dealerships within the json body.
  res.json({
    id: brand._id.toString(),
    brandName: brand.brandName,
    yearEstablished: brand.yearEstablished,
    logoUrl: brand.logoUrl,
    website: brand.website,
    country: brand.country,
    description: brand.description,
    dealerships, 
  });


  
});

//defines endpoint that creates brand
brandRouter.post("/", validate(brandSchema), async (req, res) => {
 
 const { brandName, yearEstablished, logoUrl, website, country, description } = req.body;

   const brand = await Brand.create({
    brandName,
    yearEstablished,
    logoUrl,
    website,
    country,
    description,
  });
  
  res.json(brand);
});


//defines endpoint that updates brand

brandRouter.patch("/:id", validate(brandIdSchema), async (req, res) => {
  const { id } = req.params;
  const { brandName, yearEstablished, logoUrl, website, country, description } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    id,
    { brandName,
    yearEstablished,
    logoUrl,
    website,
    country,
    description,
    }).exec();

  if (!brand) {
    throw new HttpError(NOT_FOUND, "Could not find brand.");
  }

  res.json(brand);
});

// defines endpoint that deletes brand
brandRouter.delete("/:id", validate(brandIdSchema), async (req, res) => {

  const result = await Brand.findByIdAndDelete(req.params.id).exec();

  if (!result) {
    throw new HttpError(NOT_FOUND, "Could not find brand");
  }

  res.status(SUCCESS_NO_CONTENT).end();
});


export default brandRouter;