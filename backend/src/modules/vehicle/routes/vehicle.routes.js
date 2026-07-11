const express = require("express");

const authenticate = require("../../../shared/middleware/authenticate.middleware");
const authorize = require("../../../shared/middleware/authorize.middleware");
const validate = require("../../../shared/middleware/validate.middleware");

const createVehicleSchema = require("../validators/createVehicle.validator");
const vehicleController = require("../controllers/vehicle.controller");

const router = express.Router();

/**
 * Only administrators can add new vehicles.
 * The request body is validated before reaching the controller.
 */
router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validate(createVehicleSchema),
    vehicleController.createVehicle
);
router.get(
    "/",
    authenticate,
    vehicleController.getAllVehicles
);
module.exports = router;