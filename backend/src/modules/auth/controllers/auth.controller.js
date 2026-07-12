const {
    registerUser,
    loginUser,
} = require("../services/auth.services");

const register = async (req, res, next) => {
    try {
        const result = await registerUser(req.validatedData);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                token: result.token,
                user: result.user,
            },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await loginUser(req.validatedData);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token: result.token,
                user: result.user,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
};