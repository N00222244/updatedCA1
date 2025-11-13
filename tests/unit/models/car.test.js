import Car from "../../../models/car.js";



describe("Car Model", () => {
    test("Should create Car with valid data", ()=> {
        const car = {
            modelName: "Toyota Yaris GR",
            year: 1983,
            price: 50000,
            engineSize: 1.8,
            mileage: 0,
            description: "Hot hatch",
            extras: ["Heated Seats", "All Wheel Drive Tuning"],
            brand: 1423453
        }

        expect(car.modelName).toBe(car.modelName)
        expect(car.year).toBe(car.year)
        expect(car.price).toBe(car.price);
        expect(car.engineSize).toBe(car.engineSize);
        expect(car.mileage).toBe(car.mileage);
        expect(car.description).toBe(car.description);
        expect(car.extras).toBe(car.extras);
        expect(car.brand).toBe(car.brand);
    })

    test("Should create Car with valid data while omitting description/extras", ()=> {
        const car = {
            modelName: "Toyota Yaris GR",
            year: 1983,
            price: 50000,
            engineSize: 1.8,
            mileage: 0,
            brand: 1423453
        }

        expect(car.modelName).toBe(car.modelName)
        expect(car.year).toBe(car.year)
        expect(car.price).toBe(car.price);
        expect(car.engineSize).toBe(car.engineSize);
        expect(car.mileage).toBe(car.mileage);
        expect(car.description).toBeUndefined();
        expect(car.extras).toBeUndefined();
        expect(car.brand).toBe(car.brand);
    })

    test("Should fail if extras is not an array", async () =>{
            const car = new Car({
            modelName: "Toyota Yaris GR",
            year: 1983,
            price: 50000,
            engineSize: 1.8,
            mileage: 0,
            description: "Hot hatch",
            extras: "Heated Seats, All Wheel Drive Tuning",
            brand: 1423453
            });
    
            await expect(car.validate()).rejects.toThrow();        
        });


    
});