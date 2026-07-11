const userRepository = require("../../user/repositories/user.repository");
const { hashPassword } = require("../../../shared/utils/password.utils");

const registerUser = async ({ name, email, password }) => {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        const error = new Error("Email already exists");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await hashPassword(password);

    const user = await userRepository.create({
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

module.exports = {
    registerUser,
};