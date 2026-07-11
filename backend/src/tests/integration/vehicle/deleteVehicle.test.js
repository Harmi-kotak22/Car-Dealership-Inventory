const request = require("supertest");

const app = require("../../../app");

const Vehicle = require("../../../modules/vehicle/models/vehicle.model");
const User = require("../../../modules/user/models/user.model");

const { createAdminToken } = require("../../helpers/auth.helper");

describe("DELETE /api/vehicles/:id", () => {

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

    it("should reject unauthenticated requests", async () => {

        const response = await request(app)
            .delete(`/api/vehicles/${vehicle.id}`);

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);

    });

    it("should reject CUSTOMER users from deleting vehicles", async () => {

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
            .delete(`/api/vehicles/${vehicle.id}`)
            .set("Authorization", `Bearer ${login.body.data.token}`);

        expect(response.status).toBe(403);

    });

    it("should delete an existing vehicle", async () => {

        const response = await request(app)
            .delete(`/api/vehicles/${vehicle.id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message)
            .toBe("Vehicle deleted successfully");

    });

    it("should remove the vehicle from the database", async () => {

        await request(app)
            .delete(`/api/vehicles/${vehicle.id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        const deletedVehicle = await Vehicle.findById(vehicle.id);

        expect(deletedVehicle).toBeNull();

    });

    it("should return 404 when vehicle does not exist", async () => {

        const response = await request(app)
            .delete("/api/vehicles/686111111111111111111111")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(404);

        expect(response.body.success).toBe(false);

    });

    it("should reject an invalid vehicle id", async () => {

        const response = await request(app)
            .delete("/api/vehicles/invalid-id")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

    });

});