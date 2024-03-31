import { Response } from "express";
import { CookieOptions } from "express";
import { Admin, IAdminDocument } from "../models/admin.model";

export const sendToken = async (
  res: Response,
  admin: IAdminDocument,
  message: string,
  statusCode: number = 200
): Promise<void> => {
  const token = await admin.generateToken();
  const options: CookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() +
        parseInt(`${process.env.COOKIE_EXPIRE}`) * 24 * 60 * 60 * 1000
    ),
    secure: true,
    sameSite: "none",
  };
  res.cookie("token", token, options).status(statusCode).json({
    success: true,
    message,
    admin,
  });
};
