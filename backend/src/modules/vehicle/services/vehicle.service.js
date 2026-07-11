const createVehicleSchema = require("../validators/createVehicle.validator");
const vehicleRepository = require("../repositories/vehicle.repository");

/**
 * Validates vehicle payload and delegates persistence
 * to the repository layer.
 */
const createVehicle = async (payload) => {
    const validatedData = createVehicleSchema.parse(payload);

    return vehicleRepository.create(validatedData);
};

module.exports = {
    createVehicle,
};