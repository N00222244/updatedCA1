import createApp from "../../app.js";
import request from "supertest";
import User from "../../models/user.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

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

  describe("POST /api/register", () => {
    test("should register a new user with valid credentials", async () => {
      const response = await request(app).post("/api/register").send({
        name: "user",
        email: "newuser@example.com",
        password: "SecurePass123",
        phone: "324553",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "User created successfully"
      );
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("name", "user");
      expect(response.body.user).toHaveProperty("email", "newuser@example.com");
      expect(response.body.user).toHaveProperty("role", "user");
      expect(response.body.user).not.toHaveProperty("passwordHash");
      expect(response.body.user).toHaveProperty("phone", "324553");
    });

    test("should not register user with duplicate email", async () => {
      // Create first user
      await request(app).post("/api/register").send({
        name: "user",
        email: "duplicate@example.com",
        password: "Password123",
        phone: "45287623",
      });

      // Try to create duplicate
      const response = await request(app).post("/api/register").send({
        name: "user",
        email: "duplicate@example.com",
        password: "DifferentPass456",
        phone: "45287623",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Email already exists");
    });

    test("should reject registration with invalid email", async () => {
      const response = await request(app).post("/api/register").send({
        name: "user",
        email: "not-an-email",
        password: "Password123",
        phone: "45287623",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("should reject registration with weak password", async () => {
      const response = await request(app).post("/api/register").send({
        name: "user",
        email: "test@example.com",
        password: "weak",
        password: "45287623",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("password");
    });

    test("should reject registration without uppercase in password", async () => {
      const response = await request(app).post("/api/register").send({
        email: "test@example.com",
        password: "alllowercase123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("should reject registration without number in password", async () => {
      const response = await request(app).post("/api/register").send({
        email: "test@example.com",
        password: "NoNumbersHere",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("should reject registration with missing fields", async () => {
      const response = await request(app).post("/api/register").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("should set session cookie upon successful registration", async () => {
      const response = await request(app).post("/api/register").send({
        name:"user",
        email: "sessiontest@example.com",
        password: "TestPass123",
        phone: "53245"
      });

      expect(response.status).toBe(201);
      expect(response.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app).post("/api/register").send({
        name: "user",
        email: "logintest@example.com",
        password: "TestPass123",
        phone: "5323"
      });
    });

    test("should login with correct credentials", async () => {
      const response = await request(app).post("/api/login").send({
        email: "logintest@example.com",
        password: "TestPass123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty(
        "email",
        "logintest@example.com"
      );
      expect(response.body.user).not.toHaveProperty("passwordHash");
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    test("should reject login with incorrect password", async () => {
      const response = await request(app).post("/api/login").send({
        email: "logintest@example.com",
        password: "WrongPassword123",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });

    test("should reject login with non-existent email", async () => {
      const response = await request(app).post("/api/login").send({
        email: "nonexistent@example.com",
        password: "SomePassword123",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });

    test("should reject login with missing fields", async () => {
      const response = await request(app).post("/api/login").send({
        email: "logintest@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("should reject login with invalid email format", async () => {
      const response = await request(app).post("/api/login").send({
        email: "not-an-email",
        password: "TestPass123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/logout", () => {
    test("should logout and clear session cookie", async () => {
      // Register and login
      await request(app).post("/api/register").send({
        email: "logouttest@example.com",
        password: "TestPass123",
      });

      const agent = request.agent(app);
      await agent.post("/api/login").send({
        email: "logouttest@example.com",
        password: "TestPass123",
      });

      // Logout
      const response = await agent.post("/api/logout");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Logout successful");
    });

    test("should allow logout even without session", async () => {
      const response = await request(app).post("/api/logout");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Logout successful");
    });
  });

  describe("GET /api/me", () => {
    test("should return user info when authenticated", async () => {
      // Register and login
      await request(app).post("/api/auth/register").send({
        email: "metest@example.com",
        password: "TestPass123",
      });

      const agent = request.agent(app);
      await agent.post("/api/login").send({
        email: "metest@example.com",
        password: "TestPass123",
      });

      // Check auth status
      const response = await agent.get("/api/me");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("authenticated", true);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("email", "metest@example.com");
    });

    test("should return unauthenticated when no session", async () => {
      const response = await request(app).get("/api/me");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("authenticated", false);
    });

    test("should return unauthenticated after logout", async () => {
      // Register and login
      await request(app).post("/api/register").send({
        email: "afterlogout@example.com",
        password: "TestPass123",
      });

      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({
        email: "afterlogout@example.com",
        password: "TestPass123",
      });

      // Logout
      await agent.post("/api/logout");

      // Check auth status
      const response = await agent.get("/api/me");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("authenticated", false);
    });
  });

  describe("Session persistence", () => {
    test("should maintain session across multiple requests", async () => {
      // Register
      await request(app).post("/api/register").send({
        name: "user",
        email: "session@example.com",
        password: "TestPass123",
        phone: "5342453"
      });

      // Login with agent
      const agent = request.agent(app);
      const loginResponse = await agent.post("/api/login").send({
        email: "session@example.com",
        password: "TestPass123",
      });

      expect(loginResponse.status).toBe(200);

      // Make another request with same agent
      const meResponse = await agent.get("/api/me");

      expect(meResponse.status).toBe(200);
      expect(meResponse.body).toHaveProperty("authenticated", true);
    });
  });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});