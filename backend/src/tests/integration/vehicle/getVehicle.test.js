const request = require("supertest");

const app = require("../../../app");

const { createAdminToken } = require("../../helpers/auth.helper"); const Vehicle = require("../../../modules/vehicle/models/vehicle.model");

describe("GET /api/vehicles", () => {
    let adminToken;

    beforeEach(async () => {
        await Vehicle.deleteMany({});

        adminToken = await createAdminToken();
    });
    it("should return an empty array when no vehicles exist", async () => {
        const response = await request(app)
            .get("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data).toEqual([]);
    });

    it("should return all vehicles", async () => {
        await Vehicle.create([
            {
                make: "Toyota",
                model: "Fortuner",
                category: "SUV",
                price: 4200000,
                quantity: 10,
            },
            {
                make: "Honda",
                model: "City",
                category: "SEDAN",
                price: 1500000,
                quantity: 4,
            },
        ]);

        const response = await request(app)
            .get("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data).toHaveLength(2);
    });

    it("should return vehicles sorted by newest first", async () => {
        const first = await Vehicle.create({
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4200000,
            quantity: 10,
        });

        const second = await Vehicle.create({
            make: "BMW",
            model: "X5",
            category: "SUV",
            price: 9500000,
            quantity: 2,
        });

        const response = await request(app)
            .get("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);

        expect(response.body.data[0].id).toBe(second.id);

        expect(response.body.data[1].id).toBe(first.id);
    });

    it("should not expose internal mongoose fields", async () => {
        await Vehicle.create({
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4200000,
            quantity: 10,
        });

        const response = await request(app)
            .get("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);

        expect(response.body.data[0]).not.toHaveProperty("__v");

        expect(response.body.data[0]).not.toHaveProperty("_id");
    });

    it("should reject unauthenticated users", async () => {
        const response = await request(app)
            .get("/api/vehicles");

        expect(response.status).toBe(401);

        expect(response.body.success).toBe(false);
    });
});