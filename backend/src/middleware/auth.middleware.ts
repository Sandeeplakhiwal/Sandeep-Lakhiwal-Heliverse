import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "./catchAsyncError";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utils/errorhandler";
import { Admin, IAdminDocument } from "../models/admin.model";

export interface AuthRequest extends Request {
  admin?: IAdminDocument | null;
}

export const isAuthenticated = catchAsyncError(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) return next(new ErrorHandler("Not Logged In", 401));
    const decoded = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`
    ) as JwtPayload;
    req.admin = await Admin.findById(decoded._id);
    next();
  }
);
