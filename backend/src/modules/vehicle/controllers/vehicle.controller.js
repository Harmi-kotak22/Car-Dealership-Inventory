const { createVehicle } = require("../services/vehicle.service");
const { toVehicleDto } = require("../dtos/vehicle.dto");

/**
 * Creates a new vehicle.
 */
const create = async (req, res, next) => {
    try {
        const vehicle = await createVehicle(req.body);

        return res.status(201).json({
            success: true,
            data: toVehicleDto(vehicle),
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createVehicle: create,
};