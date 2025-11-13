import Brand from "../../../models/brand.js";
import { brandSchema } from "../../../utils/validators.js";


describe("Brand Model", () => {
    test("should create Brand with valid data", ()=> {
        const brand1 = {
            brandName: "Toyota",
            yearEstablished: 1983,
            logoUrl: "https/blahblah",
            website: "toyota.com",
            country: "japan",
            description: "Best automakers in the world"
        }

        expect(brand1.brandName).toBe(brand1.brandName)
        expect(brand1.yearEstablished).toBe(brand1.yearEstablished)
        expect(brand1.logoUrl).toBe(brand1.logoUrl);
        expect(brand1.website).toBe(brand1.website);
        expect(brand1.country).toBe(brand1.country);
        expect(brand1.description).toBe(brand1.description);
    })


    test("should create Brand without description", ()=> {
        const brand1 = {
            brandName: "Toyota",
            yearEstablished: 1983,
            logoUrl: "https/blahblah",
            website: "toyota.com",
            country: "japan",
            
        }

        expect(brand1.brandName).toBe(brand1.brandName)
        expect(brand1.yearEstablished).toBe(brand1.yearEstablished)
        expect(brand1.logoUrl).toBe(brand1.logoUrl);
        expect(brand1.website).toBe(brand1.website);
        expect(brand1.country).toBe(brand1.country);
        expect(brand1.description).toBeUndefined();
    })

    test("Should fail if missing values", async () =>{
        const brand2 = new Brand({
            brandName: "",
            yearEstablished: 1983,
            logoUrl: "https/blahblah",
            website: "toyota.com",
            country: "japan",
            description: "Best automakers in the world"
        });

        await expect(brand2.validate()).rejects.toThrow();
        
    });


    test("Should fail if yearEstablished is not a number", async () =>{
        const brand2 = new Brand({
            brandName: "Toyota",
            yearEstablished: "HelloWorld",
            logoUrl: "https/blahblah",
            website: "toyota.com",
            country: "japan",
            description: "Best automakers in the world"
        });

        await expect(brand2.validate()).rejects.toThrow();        
    });

    test("Should fail if yearEstablished is not within minimum range(1810)", async () =>{
        const brand2 = new Brand({
            brandName: "Toyota",
            yearEstablished: 1700,
            logoUrl: "https/blahblah",
            website: "toyota.com",
            country: "japan",
            description: "Best automakers in the world"
        });

        await expect(brand2.validate()).rejects.toThrow();        
    });


    
});