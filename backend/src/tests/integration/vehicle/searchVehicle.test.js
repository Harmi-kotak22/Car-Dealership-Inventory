const request = require("supertest");

const app = require("../../../app");

const Vehicle = require("../../../modules/vehicle/models/vehicle.model");

const { createAdminToken } = require("../../helpers/auth.helper");

describe("GET /api/vehicles/search", () => {

    let adminToken;

    beforeEach(async () => {
        await Vehicle.deleteMany({});

        adminToken = await createAdminToken();
    });

});

it("should return an empty array when no vehicles match", async () => {
    const response = await request(app)
        .get("/api/vehicles/search?make=Toyota")
        .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toEqual([]);
});

it("should search vehicles by make", async () => {

    await Vehicle.create([
        {
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4000000,
            quantity: 5,
        },
        {
            make: "Honda",
            model: "City",
            category: "SEDAN",
            price: 1500000,
            quantity: 3,
        },
    ]);

    const response = await request(app)
        .get("/api/vehicles/search?make=Toyota")
        .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveLength(1);

    expect(response.body.data[0].make).toBe("Toyota");
});

it("should search vehicles by model", async () => {

    await Vehicle.create([
        {
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4000000,
            quantity: 5,
        },
        {
            make: "Toyota",
            model: "Innova",
            category: "SUV",
            price: 3000000,
            quantity: 4,
        },
    ]);

    const response = await request(app)
        .get("/api/vehicles/search?model=Fortuner")
        .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveLength(1);

    expect(response.body.data[0].model).toBe("Fortuner");
});

it("should search vehicles by category", async () => {

    await Vehicle.create([
        {
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4000000,
            quantity: 5,
        },
        {
            make: "Honda",
            model: "City",
            category: "SEDAN",
            price: 1500000,
            quantity: 3,
        },
    ]);

    const response = await request(app)
        .get("/api/vehicles/search?category=SUV")
        .set("Authorization", `Bearer ${adminToken}`);

    expect(response.body.data).toHaveLength(1);

    expect(response.body.data[0].category).toBe("SUV");
});

it("should filter vehicles by minimum price", async () => {

    await Vehicle.create([
        {
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4500000,
            quantity: 5,
        },
        {
            make: "Honda",
            model: "City",
            category: "SEDAN",
            price: 1200000,
            quantity: 3,
        },
    ]);

    const response = await request(app)
        .get("/api/vehicles/search?minPrice=2000000")
        .set("Authorization", `Bearer ${adminToken}`);

    expect(response.body.data).toHaveLength(1);

    expect(response.body.data[0].make).toBe("Toyota");
});

it("should filter vehicles by maximum price", async () => {

    await Vehicle.create([
        {
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4500000,
            quantity: 5,
        },
        {
            make: "Honda",
            model: "City",
            category: "SEDAN",
            price: 1200000,
            quantity: 3,
        },
    ]);

    const response = await request(app)
        .get("/api/vehicles/search?maxPrice=2000000")
        .set("Authorization", `Bearer ${adminToken}`);

    expect(response.body.data).toHaveLength(1);

    expect(response.body.data[0].make).toBe("Honda");
});

it("should filter vehicles within a price range", async () => {

    await Vehicle.create([
        {
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4500000,
            quantity: 5,
        },
        {
            make: "Honda",
            model: "City",
            category: "SEDAN",
            price: 1200000,
            quantity: 3,
        },
        {
            make: "BMW",
            model: "X5",
            category: "SUV",
            price: 7000000,
            quantity: 2,
        },
    ]);

    const response = await request(app)
        .get("/api/vehicles/search?minPrice=1000000&maxPrice=5000000")
        .set("Authorization", `Bearer ${adminToken}`);

    expect(response.body.data).toHaveLength(2);
});

it("should apply multiple search filters", async () => {

    await Vehicle.create([
        {
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4200000,
            quantity: 5,
        },
        {
            make: "Toyota",
            model: "Corolla",
            category: "SEDAN",
            price: 1800000,
            quantity: 2,
        },
    ]);

    const response = await request(app)
        .get("/api/vehicles/search?make=Toyota&category=SUV")
        .set("Authorization", `Bearer ${adminToken}`);

    expect(response.body.data).toHaveLength(1);

    expect(response.body.data[0].model).toBe("Fortuner");
});

it("should reject unauthenticated requests", async () => {

    const response = await request(app)
        .get("/api/vehicles/search");

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
});

it("should not expose internal mongoose fields", async () => {

    await Vehicle.create({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 4200000,
        quantity: 5,
    });

    const response = await request(app)
        .get("/api/vehicles/search")
        .set("Authorization", `Bearer ${adminToken}`);

    expect(response.body.data[0]).not.toHaveProperty("_id");

    expect(response.body.data[0]).not.toHaveProperty("__v");
});