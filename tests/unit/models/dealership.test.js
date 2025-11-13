import Dealership from "../../../models/dealership.js";
import mongoose from "mongoose";



describe("Dealership Model", () => {
    test("Should create Dealership with valid data", ()=> {
        const dealership = {
            dealershipName: "Bray Motors",
            location: "50 castlestreet",
            phone: "0535323",
             brands: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
            ], 
            manager: new mongoose.Types.ObjectId(),   
        }

        expect(dealership.dealershipName).toBe(dealership.dealershipName)
        expect(dealership.location).toBe(dealership.location)
        expect(dealership.phone).toBe(dealership.phone);
        expect(dealership.brands).toBe(dealership.brands);
        expect(dealership.manager).toBe(dealership.manager);
        
    })


    test("Should fail by ommiting name", async ()=> {
        const dealership = new Dealership ({
            dealershipName: "",
            location: "50 castlestreet",
            phone: "0535323",
             brands: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
            ], 
            manager: new mongoose.Types.ObjectId(),   
        })

        await expect(dealership.validate()).rejects.toThrow();      
    })


    test("Should fail by ommiting location", async ()=> {
        const dealership = new Dealership ({
            dealershipName: "Bray Motors",
            location: "",
            phone: "0535323",
            brands: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
            ], 
            manager: new mongoose.Types.ObjectId(),   
        })

        await expect(dealership.validate()).rejects.toThrow();      
    })


     test("Should fail by ommiting phone", async ()=> {
        const dealership = new Dealership ({
            dealershipName: "Bray Motors",
            location: "Castle Street",
            phone: "",
             brands: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
            ], 
            manager: new mongoose.Types.ObjectId(),   
        })

        await expect(dealership.validate()).rejects.toThrow();      
    })
     
});