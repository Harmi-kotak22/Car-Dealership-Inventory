const { registerUser } = require("../services/auth.services");

const register = async (req, res, next) => {
    try {
        const user = await registerUser(req.validatedData);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
};