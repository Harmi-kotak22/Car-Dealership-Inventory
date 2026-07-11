const { createVehicle } = require("../services/vehicle.service");

/**
 * Creates a new vehicle.
 */
const create = async (req, res, next) => {
    try {
        const vehicle = await createVehicle(req.body);

        return res.status(201).json({
            success: true,
            data: vehicle,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createVehicle: create,
};