module.exports = (requiredRole) => {
    return (req, res, next) => {
        next();
    };
};