const User = require("../models/user.model");

const findByEmail = async (email) => {
    return User.findOne({ email });
};

const create = async (userData) => {
    return User.create(userData);
};

module.exports = {
    findByEmail,
    create,
};