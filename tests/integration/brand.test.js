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
    role: "admin", // override role
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

  
  describe("GET /api/brand/", () => {


    test("Should an admin create a brand", async () => {

        const agent = request.agent(app);


        

        const { email, password } = await createAdminUser();

        await agent.post("/api/login").send({ email, password });

         const response = await agent.post("/api/brand").send({
            brandName: "Cupra",
            yearEstablished: 1849,
            logoUrl: "https://example.com/logos/toyota.png",
            website: "https://www.toyota.com",
            country: "Japan",
            description: "Toyota is a multinational automotive manufacturer known for reliability and innovation."
         })

         expect(response.status).toBe(200);
    });
    
    
  });

    

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});