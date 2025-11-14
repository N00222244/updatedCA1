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

const createManagerUser = async () => {
  const passwordHash = await User.hashPassword("Password123");
  const manager = await User.create({
    name: "managerUser",
    email: "manager@example.com",
    passwordHash,
    phone: "45287623",
    role: "manager", 
  });
  return { manager, email: manager.email, password: "Password123" };
};

const createOrdinaryUser = async () => {
  const passwordHash = await User.hashPassword("Password123");
  const user = await User.create({
    name: "User",
    email: "User@example.com",
    passwordHash,
    phone: "45287623",
    role: "user", 
  });
  return { user, email: user.email, password: "Password123" };
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


    test("admin create a dealership", async () => {

        const agent = request.agent(app);


        

        const { email, password } = await createManagerUser();

        await agent.post("/api/login").send({ email, password });
        
         const response = await agent.post("/api/dealership").send({
            dealershipName: "Bray Motors",
            location: "50 castlestreet",
            phone: "0535323",
            brands: [
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId()
                ], 
            manager: new mongoose.Types.ObjectId(),
         })

         expect(response.status).toBe(200);
    });

    test("manager can edit a dealership", async () => {

        const agent = request.agent(app);
        const { email, password } = await createManagerUser();

        await agent.post("/api/login").send({ email, password });

         const createDealership = await agent.post("/api/dealership").send({
            dealershipName: "Bray Motors",
            location: "50 castlestreet",
            phone: "0535323",
            brands: [
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId()
                ], 
            manager: new mongoose.Types.ObjectId(),
         })

        expect(createDealership.status).toBe(200);
        const dealershipId = createDealership.body.id;


        const updateResponse = await agent.patch(`/api/dealership/${dealershipId}`).send({
            dealershipName: "Dublin Motors",
            
        });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.dealershipName).toBe("Dublin Motors");
        

         
    });
    


    test("manager can delete a dealership", async () => {

        const agent = request.agent(app);
        const { email, password } = await createManagerUser();

        await agent.post("/api/login").send({ email, password });

         const createDealership = await agent.post("/api/dealership").send({
            dealershipName: "Bray Motors",
            location: "50 castlestreet",
            phone: "0535323",
            brands: [
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId()
                ], 
            manager: new mongoose.Types.ObjectId(),
         })

        expect(createDealership.status).toBe(200);
        const dealershipId = createDealership.body.id;


        const deleteResource = await agent.delete(`/api/dealership/${dealershipId}`)

        expect(deleteResource.status).toBe(204);
    
         
    });



    test("fail user create a car", async () => {

        const agent = request.agent(app);


        const { email, password } = await createOrdinaryUser();

        await agent.post("/api/login").send({ email, password });

         const response = await agent.post("/api/dealership").send({
             dealershipName: "Bray Motors",
            location: "50 castlestreet",
            phone: "0535323",
            brands: [
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId()
                ], 
            manager: new mongoose.Types.ObjectId(),
         })

         expect(response.status).toBe(403);
    });
    


    
    
  });

    

    



    


    test("user can get all dealerships", async () => {

        const agent = request.agent(app);
        const { email, password } = await createOrdinaryUser();
        await agent.post("/api/login").send({ email, password });
        const updateResponse = await agent.get(`/api/dealership`)
        expect(updateResponse.status).toBe(200);
      
    });


    test("Manager cannot edit another manager's dealership", async () => {
        const agent1 = request.agent(app);
        const agent2 = request.agent(app);

  
        const { email: email, password: password, id: agent1UserId} = await createManagerUser(agent1);
        await agent1.post("/api/login").send({ email: email, password: password });

  
        const createDealership = await agent1.post("/api/dealership").send({
            dealershipName: "Bray Motors",
            location: "Street 1",
            phone: "111111",
            brands: [new mongoose.Types.ObjectId()],
            manager: agent1UserId, 
        });

    expect(createDealership.status).toBe(200);
        const dealershipId = createDealership.body.id;

  
    const { email: email2, password: password2 , } = await createManagerUser(agent2);
    await agent2.post("/api/login").send({ email: email2, password: password2 });

  
  const editResponse = await agent2.patch(`/api/dealership/${dealershipId}`).send({
    dealershipName: "Dublin Motors",
  });

  expect(editResponse.status).toBe(403); 


  const getResponse = await agent2.get(`/api/dealership/${dealershipId}`);
  expect(getResponse.status).toBe(200);
  expect(getResponse.body.dealershipName).toBe("Bray Motors");
});











    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

});