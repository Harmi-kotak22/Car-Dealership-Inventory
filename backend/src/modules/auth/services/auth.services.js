const userRepository = require("../../user/repositories/user.repository");
const { hashPassword } = require("../../../shared/utils/password.utils");
const ApiError = require("../../../shared/errors/ApiError");

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

module.exports = {
    registerUser,
};