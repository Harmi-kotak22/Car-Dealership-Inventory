const userRepository = require("../../user/repositories/user.repository");
const ApiError = require("../../../shared/errors/ApiError");

const {
    hashPassword,
    comparePassword,
} = require("../../../shared/utils/password.utils");

const { generateToken } = require("../../../shared/utils/jwt.utils");
const { ADMIN_CODE } = require("../../../config/env");

const registerUser = async ({ name, email, password, adminCode }) => {
    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        throw new ApiError(409, "Email already exists");
    }

    const hashedPassword = await hashPassword(password);
    let role = "CUSTOMER";

    if (adminCode) {
        if (!ADMIN_CODE) {
            throw new ApiError(500, "Admin signup is not configured");
        }

        if (adminCode !== ADMIN_CODE) {
            throw new ApiError(401, "Invalid admin code");
        }

        role = "ADMIN";
    }

    const user = await userRepository.createUser({
        name,
        email,
        password: hashedPassword,
        role,
    });

    const token = generateToken({
        id: user._id,
        role: user.role,
    });

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

const loginUser = async ({ email, password }) => {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken({
        id: user._id,
        role: user.role,
    });

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

module.exports = {
    registerUser,
    loginUser,
};