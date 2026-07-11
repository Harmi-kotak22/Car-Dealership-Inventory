// const request = require("supertest");
// const app = require("../../../app");

// describe("Authentication Middleware", () => {

//     it("should reject requests without a token", async () => {

//         const response = await request(app)
//             .get("/api/test/protected");

//         expect(response.status).toBe(401);

//         expect(response.body.success).toBe(false);
//     });

//     it("should reject invalid JWT tokens", async () => {

//         const response = await request(app)
//             .get("/api/test/protected")
//             .set("Authorization", "Bearer invalid-token");

//         expect(response.status).toBe(401);

//         expect(response.body.success).toBe(false);
//     });

// });
describe("Authentication Middleware", () => {
    test.skip("TODO", () => {});
});