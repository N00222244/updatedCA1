import createApp from "../../app.js";
import request from "supertest";
import User from "../../models/user.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();




const createAdminUser = async () => {
  const passwordHash = await User.hashPassword("Password123");
  const admin = await User.create({
    name: "adminUser",
    email: "admin@example.com",
    passwordHash,
    phone: "45287623",
    role: "admin", 
  });
  return { admin, email: admin.email, password: "Password123" };
};

const createOrdinaryUser = async () => {
  const passwordHash = await User.hashPassword("Password123");
  const admin = await User.create({
    name: "User",
    email: "User@example.com",
    passwordHash,
    phone: "45287623",
    role: "user", 
  });
  return { admin, email: admin.email, password: "Password123" };
};



describe("Auth API", () => {
  let app;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    app = createApp();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await mongoose.connection.db.collection("sessions").deleteMany({});
  });

  
  describe("/api/car/", () => {


    test("admin create a car", async () => {

        const agent = request.agent(app);


        

        const { email, password } = await createAdminUser();

        await agent.post("/api/login").send({ email, password });

         const response = await agent.post("/api/car").send({
            modelName: "Toyota Yaris GR",
            year: 1983,
            price: 50000,
            engineSize: 1.8,
            mileage: 0,
            description: "Hot hatch",
            extras: ["Heated Seats", "All Wheel Drive Tuning"],
            brand: new mongoose.Types.ObjectId(),
         })

         expect(response.status).toBe(200);
    });

    test("admin can edit a car", async () => {

        const agent = request.agent(app);
        const { email, password } = await createAdminUser();

        await agent.post("/api/login").send({ email, password });

         const createCar = await agent.post("/api/car").send({
            modelName: "Toyota Yaris GR",
            year: 1983,
            price: 50000,
            engineSize: 1.8,
            mileage: 0,
            description: "Hot hatch",
            extras: ["Heated Seats", "All Wheel Drive Tuning"],
            brand: new mongoose.Types.ObjectId(),
         })

        expect(createCar.status).toBe(200);
        const carId = createCar.body.id;


        const updateResponse = await agent.patch(`/api/car/${carId}`).send({
            modelName: "Cupra",
            description: "Not a hot hatch"
        });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.modelName).toBe("Cupra");
        expect(updateResponse.body.description).toBe("Not a hot hatch");

         
    });
    


    test("admin can delete a car", async () => {

        const agent = request.agent(app);


        

        const { email, password } = await createAdminUser();

        await agent.post("/api/login").send({ email, password });

         const createCar = await agent.post("/api/car").send({
            modelName: "Toyota Yaris GR",
            year: 1983,
            price: 50000,
            engineSize: 1.8,
            mileage: 0,
            description: "Hot hatch",
            extras: ["Heated Seats", "All Wheel Drive Tuning"],
            brand: new mongoose.Types.ObjectId(),
         })

        expect(createCar.status).toBe(200);
        const carId = createCar.body.id;


        const deleteResource = await agent.delete(`/api/car/${carId}`)

        expect(deleteResource.status).toBe(204);
    
         
    });



    test("fail user create a car", async () => {

        const agent = request.agent(app);


        const { email, password } = await createOrdinaryUser();

        await agent.post("/api/login").send({ email, password });

         const response = await agent.post("/api/car").send({
            modelName: "Toyota Yaris GR",
            year: 1983,
            price: 50000,
            engineSize: 1.8,
            mileage: 0,
            description: "Hot hatch",
            extras: ["Heated Seats", "All Wheel Drive Tuning"],
            brand: new mongoose.Types.ObjectId(),
         })

         expect(response.status).toBe(403);
    });
    


    test("user cant delete a car", async () => {

        const agent = request.agent(app);


        const { email, password } = await createOrdinaryUser();

        await agent.post("/api/login").send({ email, password });

         const createCar = await agent.post("/api/car").send({
            modelName: "Toyota Yaris GR",
            year: 1983,
            price: 50000,
            engineSize: 1.8,
            mileage: 0,
            description: "Hot hatch",
            extras: ["Heated Seats", "All Wheel Drive Tuning"],
            brand: new mongoose.Types.ObjectId(),
         })

        expect(createCar.status).toBe(403);
        const carId = createCar.body.id;


        const deleteResource = await agent.delete(`/api/car/${carId}`)

        expect(deleteResource.status).toBe(403);
          
    });
    
  });

    

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });



    test("user cant edit a car", async () => {

        const agent = request.agent(app);
        const { email, password } = await createOrdinaryUser();

        await agent.post("/api/login").send({ email, password });

         const createCar = await agent.post("/api/car").send({
            modelName: "Toyota Yaris GR",
            year: 1983,
            price: 50000,
            engineSize: 1.8,
            mileage: 0,
            description: "Hot hatch",
            extras: ["Heated Seats", "All Wheel Drive Tuning"],
            brand: new mongoose.Types.ObjectId(),
         })

        expect(createCar.status).toBe(403);
        const carId = createCar.body.id;


        const updateResponse = await agent.patch(`/api/car/${carId}`).send({
            brandName: "Cupra",
            description: "Cupra - worst built cars in the world"
        });

        expect(updateResponse.status).toBe(403);
      
    });


    test("user can get all cars", async () => {

        const agent = request.agent(app);
        const { email, password } = await createOrdinaryUser();
        await agent.post("/api/login").send({ email, password });
        const updateResponse = await agent.get(`/api/car`)
        expect(updateResponse.status).toBe(200);
      
    });






});