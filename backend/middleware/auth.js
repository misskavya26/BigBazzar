const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const ErrorHandler = require('../utils/errorHandler');

const authentication = asyncHandler(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler('Please Login to Access this Resuorce', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
})

const authorized = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} has no resource to access this`, 403));
        }

        next();
    }
}

module.exports = { authentication, authorized };