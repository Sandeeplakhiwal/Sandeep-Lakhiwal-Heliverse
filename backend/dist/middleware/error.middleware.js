"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";
    // Wrong mongodb id error
    if (err.name === "JsonWebTokenError") {
        const message = `Resouce not found. Invalid ${err.path}`;
        err = new errorhandler_1.default(message, 400);
    }
    // Wrong JsonWebToken
    if (err.name === "JsonWebTokenError") {
        const message = "Json Web Token is invalid, try again";
        err = new errorhandler_1.default(message, 400);
    }
    // JWT expire error
    if (err.name === "TokenExpiredError") {
        const message = `Json web token is expired, try again`;
        err = new errorhandler_1.default(message, 400);
    }
    return res.status(err.statusCode).json({
        success: true,
        error: err.message,
    });
};
exports.default = ErrorMiddleware;
