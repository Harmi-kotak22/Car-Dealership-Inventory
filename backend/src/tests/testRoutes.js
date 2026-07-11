const express = require("express");

const authenticate = require("../shared/middleware/authenticate.middleware");
const authorize = require("../shared/middleware/authorize.middleware");

const router = express.Router();

router.get(
    "/protected",
    authenticate,
    (req, res) => { 
        res.status(200).json({
            success: true,
            user: req.user,
        });
    }
);

router.get(
    "/admin",
    authenticate,
    authorize("ADMIN"),
    (req, res) => {
        res.status(200).json({
            success: true,
        });
    }
);

module.exports = router;