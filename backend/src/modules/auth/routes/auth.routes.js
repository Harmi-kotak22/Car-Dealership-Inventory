const express = require("express");

const { register } = require("../controllers/auth.controller");
const validate = require("../../../shared/middleware/validate.middleware");
const registerSchema = require("../validators/register.validator");

const router = express.Router();

router.post(
    "/register",
    validate(registerSchema),
    register
);

module.exports = router;