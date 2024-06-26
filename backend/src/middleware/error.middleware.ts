import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorhandler";

const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // Wrong mongodb id error
  if (err.name === "JsonWebTokenError") {
    const message = `Resouce not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JsonWebToken
  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is invalid, try again";
    err = new ErrorHandler(message, 400);
  }

  // JWT expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  return res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};

export default ErrorMiddleware;
