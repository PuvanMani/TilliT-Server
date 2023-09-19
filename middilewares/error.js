const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV == "development") {
        return res.status(err.statusCode).json({
            status: false,
            message: err.message,
            stack: err.stack
        })
    }


    if (process.env.NODE_ENV == "production") {
        let message = err.message
        let error = err

        if (error.name == "ValidationError") {
            message = Object.values(err.errors).map(val => val.message);
            error = new ErrorHandler(message, 400);

        }
        if (error.name == "CastError") {
            message = `Resource Not Found ${err.path}`
            error = new ErrorHandler(message, 400);
        }
        if (error.code == 11000) {
            message = `Duplicate Key ${Object.values(err.keyValue)} Error`
            error = new ErrorHandler(message, 400);
        }
        if (error.name == "JSONWebTokenError") {
            message = `JSON web Token is invalid, try again`
            error = new ErrorHandler(message, 400);
        }
        if (error.name == "JSONWebTokenError") {
            message = `JSON web Token is Experies`
            error = new ErrorHandler(message, 400);
        }

        res.status(err.statusCode).json({
            status: false,
            message: error.message || "Internal Server Error"
        })
    }
}