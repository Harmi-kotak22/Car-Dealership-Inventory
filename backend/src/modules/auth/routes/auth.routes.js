const express = require("express");

const {
    register,
    login,
} = require("../controllers/auth.controller");

const validate = require("../../../shared/middleware/validate.middleware");

const registerSchema = require("../validators/register.validator");
const loginSchema = require("../validators/login.validator");

const router = express.Router();

router.post(
    "/register",
    validate(registerSchema),
    register
);

router.post(
    "/login",
    validate(loginSchema),
    login
);

module.exports = router;