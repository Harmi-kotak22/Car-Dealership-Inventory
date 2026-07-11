const { z } = require("zod");
const VEHICLE_CATEGORIES = require("../../../shared/constants/vehicleCategories");

const createVehicleSchema = z
    .object({
        make: z.string().trim().min(1, "Make is required"),

        model: z.string().trim().min(1, "Model is required"),

        category: z.enum(Object.values(VEHICLE_CATEGORIES), {
            errorMap: () => ({
                message: "Invalid vehicle category",
            }),
        }),

        price: z.number().min(0, "Price cannot be negative"),

        quantity: z.number().int().min(0, "Quantity cannot be negative"),
    })
    .strict();

module.exports = createVehicleSchema;