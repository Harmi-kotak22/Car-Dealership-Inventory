const userRepository = require("../../user/repositories/user.repository");
const ApiError = require("../../../shared/errors/ApiError");

const {
    hashPassword,
    comparePassword,
} = require("../../../shared/utils/password.utils");

const { generateToken } = require("../../../shared/utils/jwt.utils");

const registerUser = async ({ name, email, password }) => {
    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        throw new ApiError(409, "Email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await userRepository.createUser({
        name,
        email,
        password: hashedPassword,
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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