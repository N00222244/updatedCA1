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

  
  describe("/api/brand/", () => {


    test("admin create a brand", async () => {

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

    test("admin edit a brand", async () => {

        const agent = request.agent(app);
        const { email, password } = await createAdminUser();

        await agent.post("/api/login").send({ email, password });

         const createBrand = await agent.post("/api/brand").send({
            brandName: "Cupra",
            yearEstablished: 1849,
            logoUrl: "https://example.com/logos/toyota.png",
            website: "https://www.toyota.com",
            country: "Japan",
            description: "Toyota is a multinational automotive manufacturer known for reliability and innovation."
         })

        expect(createBrand.status).toBe(200);
        const brandId = createBrand.body.id;


        const updateResponse = await agent.patch(`/api/brand/${brandId}`).send({
            brandName: "Toyota",
            description: "Toyora - best built cars in the world"
        });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.brandName).toBe("Toyota");
        expect(updateResponse.body.description).toBe("Toyora - best built cars in the world");

         
    });
    


    test("admin can delete a brand", async () => {

        const agent = request.agent(app);


        

        const { email, password } = await createAdminUser();

        await agent.post("/api/login").send({ email, password });

         const createBrand = await agent.post("/api/brand").send({
            brandName: "Cupra",
            yearEstablished: 1849,
            logoUrl: "https://example.com/logos/toyota.png",
            website: "https://www.toyota.com",
            country: "Japan",
            description: "Toyota is a multinational automotive manufacturer known for reliability and innovation."
         })

        expect(createBrand.status).toBe(200);
        const brandId = createBrand.body.id;


        const deleteResource = await agent.delete(`/api/brand/${brandId}`)

        expect(deleteResource.status).toBe(204);
    
         
    });



    test("fail user create a brand", async () => {

        const agent = request.agent(app);


        const { email, password } = await createOrdinaryUser();

        await agent.post("/api/login").send({ email, password });

         const response = await agent.post("/api/brand").send({
            brandName: "Cupra",
            yearEstablished: 1849,
            logoUrl: "https://example.com/logos/toyota.png",
            website: "https://www.toyota.com",
            country: "Japan",
            description: "Toyota is a multinational automotive manufacturer known for reliability and innovation."
         })

         expect(response.status).toBe(403);
    });
    


    test("user can delete a brand", async () => {

        const agent = request.agent(app);


        

        const { email, password } = await createOrdinaryUser();

        await agent.post("/api/login").send({ email, password });

         const createBrand = await agent.post("/api/brand").send({
            brandName: "Cupra",
            yearEstablished: 1849,
            logoUrl: "https://example.com/logos/toyota.png",
            website: "https://www.toyota.com",
            country: "Japan",
            description: "Toyota is a multinational automotive manufacturer known for reliability and innovation."
         })

        expect(createBrand.status).toBe(403);
        const brandId = createBrand.body.id;


        const deleteResource = await agent.delete(`/api/brand/${brandId}`)

        expect(deleteResource.status).toBe(403);
          
    });
    
  });

    

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });



    test("user cant edit a brand", async () => {

        const agent = request.agent(app);
        const { email, password } = await createOrdinaryUser();

        await agent.post("/api/login").send({ email, password });

         const createBrand = await agent.post("/api/brand").send({
            brandName: "Cupra",
            yearEstablished: 1849,
            logoUrl: "https://example.com/logos/toyota.png",
            website: "https://www.toyota.com",
            country: "Japan",
            description: "Toyota is a multinational automotive manufacturer known for reliability and innovation."
         })

        expect(createBrand.status).toBe(403);
        const brandId = createBrand.body.id;


        const updateResponse = await agent.patch(`/api/brand/${brandId}`).send({
            brandName: "Toyota",
            description: "Toyora - best built cars in the world"
        });

        expect(updateResponse.status).toBe(403);
      
    });



});