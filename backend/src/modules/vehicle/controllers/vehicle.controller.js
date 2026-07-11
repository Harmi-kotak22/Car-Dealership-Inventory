const { createVehicle,getAllVehicles, } = require("../services/vehicle.service");
const { toVehicleDto } = require("../dtos/vehicle.dto");

/**
 * Creates a new vehicle.
 */
const create = async (req, res, next) => {
    try {
        const vehicle = await createVehicle(req.validatedData);

        return res.status(201).json({
            success: true,
            data: toVehicleDto(vehicle),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Returns all available vehicles.
 */
const getAll = async (req, res, next) => {
    try {
        const vehicles = await getAllVehicles();

        return res.status(200).json({
            success: true,
            data: vehicles.map(toVehicleDto),
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createVehicle: create,
     getAllVehicles: getAll,
};