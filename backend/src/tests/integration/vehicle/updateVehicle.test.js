const { createAdminToken } = require("../../helpers/auth.helper");

const request = require("supertest");
const app = require("../../../app");

const Vehicle = require("../../../modules/vehicle/models/vehicle.model");
const User = require("../../../modules/user/models/user.model");

describe("PUT /api/vehicles/:id", () => {

    let adminToken;
    let vehicle;

    beforeEach(async () => {

        await Vehicle.deleteMany({});
        await User.deleteMany({});

        adminToken = await createAdminToken();

        vehicle = await Vehicle.create({
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4200000,
            quantity: 10,
        });

    });

});

it("should reject unauthenticated requests", async () => {

    const response = await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .send({
            make: "Honda",
        });

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

});

it("should reject CUSTOMER users from updating vehicles", async () => {

    await request(app)
        .post("/api/auth/register")
        .send({
            name: "Customer",
            email: "customer@test.com",
            password: "Password123",
        });

    const login = await request(app)
        .post("/api/auth/login")
        .send({
            email: "customer@test.com",
            password: "Password123",
        });

    const response = await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${login.body.data.token}`)
        .send({
            make: "Honda",
        });

    expect(response.status).toBe(403);

});

it("should return 404 when vehicle does not exist", async () => {

    const response = await request(app)
        .put("/api/vehicles/686111111111111111111111")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            make: "Honda",
        });

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);

});

it("should update a vehicle successfully", async () => {

    const response = await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            make: "BMW",
            model: "X5",
            category: "SUV",
            price: 9000000,
            quantity: 3,
        });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.make).toBe("BMW");

    expect(response.body.data.model).toBe("X5");

    expect(response.body.data.price).toBe(9000000);

    expect(response.body.data.quantity).toBe(3);

});

it("should persist updated values in the database", async () => {

    await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            make: "Audi",
            model: "Q7",
            category: "SUV",
            price: 8500000,
            quantity: 2,
        });

    const updatedVehicle = await Vehicle.findById(vehicle.id);

    expect(updatedVehicle.make).toBe("Audi");

    expect(updatedVehicle.model).toBe("Q7");

    expect(updatedVehicle.quantity).toBe(2);

});

it("should reject an empty make", async () => {

    const response = await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            make: "",
            model: "X5",
            category: "SUV",
            price: 9000000,
            quantity: 3,
        });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);

});

it("should reject an invalid category", async () => {

    const response = await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            make: "BMW",
            model: "X5",
            category: "SPORTS",
            price: 9000000,
            quantity: 3,
        });

    expect(response.status).toBe(400);

});

it("should reject a negative price", async () => {

    const response = await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            make: "BMW",
            model: "X5",
            category: "SUV",
            price: -10,
            quantity: 3,
        });

    expect(response.status).toBe(400);

});

it("should reject a negative quantity", async () => {

    const response = await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            make: "BMW",
            model: "X5",
            category: "SUV",
            price: 100,
            quantity: -1,
        });

    expect(response.status).toBe(400);

});

it("should reject unknown request fields", async () => {

    const response = await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            make: "BMW",
            model: "X5",
            category: "SUV",
            price: 100,
            quantity: 5,
            owner: "John",
        });

    expect(response.status).toBe(400);

});

it("should not expose internal mongoose fields", async () => {

    const response = await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            make: "BMW",
            model: "X5",
            category: "SUV",
            price: 9000000,
            quantity: 3,
        });

    expect(response.body.data).not.toHaveProperty("_id");

    expect(response.body.data).not.toHaveProperty("__v");

});