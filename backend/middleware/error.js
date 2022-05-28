const ErrorHandler = require('../utils/errorHandler');

const errorMiddleware = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Invalid Server Error";

    // -----------------------MONGODB ERROR HANDLING (PATH OR ID ISN'T CORRECT OR NOT FOUND)----------------------
    if (err.name === 'CastError') {
        const message = `Resource failed- Invalid Path: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // ------------------------------------DUPLICATE KEYERROR -----------------------------------
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} value entered`;
        err = new ErrorHandler(message, 400);
    }

    // -------------------------------------WRONG  JWT WEB TOKEN ERROR-------------------------------
    if (err.name === 'JsonWebTokenError') {
        const message = `JSON Web Token Invalid, Try Again`;
        err = new ErrorHandler(message, 400);
    }

    // -------------------------------- JWT WEB TOKEN EXPIRED ERROR ----------------------------------------
    if (err.name === 'TokenExpiredError') {
        const message = `JSON Web Token Expired, Try Again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}

module.exports = errorMiddleware;