const { createVehicle,getAllVehicles, searchVehicles, purchaseVehicle, updateVehicle, deleteVehicle, } = require("../services/vehicle.service");
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
/**
 * Searches vehicles using optional query parameters.
 */
const search = async (req, res, next) => {

    try {

        const vehicles = await searchVehicles(req.query);

        return res.status(200).json({
            success: true,
            data: vehicles.map(toVehicleDto),
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Purchases a vehicle.
 */
const purchase = async (req, res, next) => {

    try {

        const vehicle = await purchaseVehicle(req.params.id);

        return res.status(201).json({
            success: true,
            message: "Vehicle purchased successfully",
            data: toVehicleDto(vehicle),
        });

    } catch (error) {
        next(error);
    }

};

/**
 * Updates an existing vehicle.
 */
const update = async (req, res, next) => {
    try {
        const vehicle = await updateVehicle(
            req.params.id,
            req.validatedData
        );

        return res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: toVehicleDto(vehicle),
        });

    } catch (error) {
        next(error);
    }
};
/**
 * Deletes an existing vehicle.
 */
const remove = async (req, res, next) => {

    try {

        await deleteVehicle(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        });

    } catch (error) {
        next(error);
    }

};
module.exports = {
    createVehicle: create,
     getAllVehicles: getAll,
     searchVehicles: search,
     purchaseVehicle: purchase,
      updateVehicle: update,
       deleteVehicle: remove,
};