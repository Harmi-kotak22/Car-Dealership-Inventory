const request = require("supertest");

const app = require("../../../app");

const Vehicle = require("../../../modules/vehicle/models/vehicle.model");
const User = require("../../../modules/user/models/user.model");

const { createAdminToken, createCustomerToken } = require("../../helpers/auth.helper");

describe("POST /api/vehicles/:id/purchase", () => {

    let adminToken;
    let customerToken;
    let vehicle;

    beforeEach(async () => {

        await User.deleteMany({});
        await Vehicle.deleteMany({});

        adminToken = await createAdminToken();
        customerToken = await createCustomerToken();

        vehicle = await Vehicle.create({
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4200000,
            quantity: 5,
        });

    });

    it("should reject unauthenticated requests", async () => {

        const response = await request(app)
            .post(`/api/vehicles/${vehicle.id}/purchase`);

        expect(response.status).toBe(401);

        expect(response.body.success).toBe(false);

    });
    it("should reject ADMIN users from purchasing vehicles", async () => {

        const response = await request(app)
            .post(`/api/vehicles/${vehicle.id}/purchase`)
            .set("Authorization", `Bearer ${adminToken}`);


        expect(response.status).toBe(403);

        expect(response.body.success).toBe(false);

    });

    it("should purchase a vehicle successfully", async () => {

        const response = await request(app)
            .post(`/api/vehicles/${vehicle.id}/purchase`)
            .set("Authorization", `Bearer ${customerToken}`);

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe("Vehicle purchased successfully");

        expect(response.body.data.quantity).toBe(4);

    });

    it("should persist the updated quantity in the database", async () => {

        const response = await request(app)
            .post(`/api/vehicles/${vehicle.id}/purchase`)
            .set("Authorization", `Bearer ${customerToken}`);

        const updatedVehicle = await Vehicle.findById(vehicle.id);

        expect(response.status).toBe(201);

        expect(updatedVehicle.quantity).toBe(4);

    });

    it("should return 404 when the vehicle does not exist", async () => {

        const response = await request(app)
            .post("/api/vehicles/686111111111111111111111/purchase")
            .set("Authorization", `Bearer ${customerToken}`);

        expect(response.status).toBe(404);

        expect(response.body.success).toBe(false);

    });

    it("should reject purchasing when stock is zero", async () => {

        vehicle.quantity = 0;

        await vehicle.save();

        const response = await request(app)
            .post(`/api/vehicles/${vehicle.id}/purchase`)
            .set("Authorization", `Bearer ${customerToken}`);

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

    });

    it("should not expose internal mongoose fields", async () => {

        const response = await request(app)
            .post(`/api/vehicles/${vehicle.id}/purchase`)
            .set("Authorization", `Bearer ${customerToken}`);

        expect(response.status).toBe(201);

        expect(response.body.data).not.toHaveProperty("_id");

        expect(response.body.data).not.toHaveProperty("__v");

    });

});