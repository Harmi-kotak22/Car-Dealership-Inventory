
/**
 * Validates vehicle payload and delegates persistence
 * to the repository layer.
 */
const { ZodError } = require("zod");

const createVehicleSchema = require("../validators/createVehicle.validator");
const vehicleRepository = require("../repositories/vehicle.repository");
const { findAllVehicles } = require("../repositories/vehicle.repository");
/**
 * Creates a new vehicle after validating the request payload.
 */
const createVehicle = async (payload) => {
    try {
        const validatedVehicle = createVehicleSchema.parse(payload);

        const vehicle = await vehicleRepository.create(validatedVehicle);

        return vehicle;
    } catch (error) {
        if (error instanceof ZodError) {
            error.statusCode = 400;
        }

        throw error;
    }
};

/**
 * Retrieves all vehicles from inventory.
 */
const getAllVehicles = async () => {
    return await findAllVehicles();
};
module.exports = {
    createVehicle,
    getAllVehicles,
};
