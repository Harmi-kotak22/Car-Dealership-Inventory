const express = require("express");

const authenticate = require("../../../shared/middleware/authenticate.middleware");
const authorize = require("../../../shared/middleware/authorize.middleware");

const vehicleController = require("../controllers/vehicle.controller");

const router = express.Router();

/**
 * Only administrators can add vehicles.
 */
router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    vehicleController.createVehicle
);

module.exports = router;