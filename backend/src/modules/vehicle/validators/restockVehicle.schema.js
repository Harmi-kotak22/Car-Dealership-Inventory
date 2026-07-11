const request = require("supertest");

const app = require("../../../app");

const Vehicle = require("../../../modules/vehicle/models/vehicle.model");
const User = require("../../../modules/user/models/user.model");

const {
    createAdminToken,
    createCustomerToken,
} = require("../../helpers/auth.helper");

describe("POST /api/vehicles/:id/restock", () => {

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
            .post(`/api/vehicles/${vehicle.id}/restock`)
            .send({
                quantity: 5,
            });

        expect(response.status).toBe(401);

        expect(response.body.success).toBe(false);

    });

    it("should reject CUSTOMER users from restocking vehicles", async () => {

        const response = await request(app)
            .post(`/api/vehicles/${vehicle.id}/restock`)
            .set("Authorization", `Bearer ${customerToken}`)
            .send({
                quantity: 5,
            });

        expect(response.status).toBe(403);

        expect(response.body.success).toBe(false);

    });

    it("should return 404 when the vehicle does not exist", async () => {

        const response = await request(app)
            .post("/api/vehicles/686111111111111111111111/restock")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                quantity: 5,
            });

        expect(response.status).toBe(404);

        expect(response.body.success).toBe(false);

    });

    it("should restock a vehicle successfully", async () => {

        const response = await request(app)
            .post(`/api/vehicles/${vehicle.id}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                quantity: 10,
            });

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data.quantity).toBe(15);

    });

    it("should persist the updated quantity in the database", async () => {

        await request(app)
            .post(`/api/vehicles/${vehicle.id}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                quantity: 7,
            });

        const updatedVehicle = await Vehicle.findById(vehicle.id);

        expect(updatedVehicle.quantity).toBe(12);

    });

    it("should reject zero quantity", async () => {

        const response = await request(app)
            .post(`/api/vehicles/${vehicle.id}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                quantity: 0,
            });

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

    });

    it("should reject negative quantity", async () => {

        const response = await request(app)
            .post(`/api/vehicles/${vehicle.id}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                quantity: -5,
            });

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

    });

    it("should reject missing quantity", async () => {

        const response = await request(app)
            .post(`/api/vehicles/${vehicle.id}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({});

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

    });

    it("should reject unknown request fields", async () => {

        const response = await request(app)
            .post(`/api/vehicles/${vehicle.id}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                quantity: 5,
                owner: "John",
            });

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

    });

    it("should not expose internal mongoose fields", async () => {

        const response = await request(app)
            .post(`/api/vehicles/${vehicle.id}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                quantity: 5,
            });

        expect(response.status).toBe(200);

        expect(response.body.data).not.toHaveProperty("_id");

        expect(response.body.data).not.toHaveProperty("__v");

    });

});