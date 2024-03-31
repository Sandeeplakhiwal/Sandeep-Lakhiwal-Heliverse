import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { IUserDocument, User } from "../models/user.model";
import { ApiFeatures } from "../utils/apiFeature";
import ErrorHandler from "../utils/errorhandler";
import { Readable } from "stream";
import path from "path";
import os from "os";
import fs from "fs";
import cloudinary from "cloudinary";

export const createNewUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { first_name, last_name, email, gender, domain, available } =
      req.body;

    if (!first_name || !last_name || !email || !gender || !domain || !available)
      return next(new ErrorHandler("Please enter all fields", 400));

    if (!req.file) {
      return next(new ErrorHandler("Please add avatar", 400));
    }

    // Create a Readable stream for buffer
    const bufferStream = new Readable();

    bufferStream.push(req.file.buffer);
    bufferStream.push(null); // Signals the end of the stream

    // Create a temporary file path
    const tempFilePath = path.join(os.tmpdir(), `${req.file.originalname}`);

    // Create a WriteStream to write the Buffer data to the temporary file
    const writeStream = fs.createWriteStream(tempFilePath);
    bufferStream.pipe(writeStream);

    // Wait for the stream to finish writing to the file
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // Upload the temporary file to Cloudinary
    const cloud = await cloudinary.v2.uploader.upload(tempFilePath, {
      folder: "users",
    });

    // Delete the temporary file after upload
    fs.unlinkSync(tempFilePath);

    const user = await User.create({
      first_name,
      last_name,
      avatar: cloud.url || "",
      email,
      gender,
      domain,
      available,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  }
);

export const getAllUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const resultPerPage = 10;

    const apiFeature = new ApiFeatures<IUserDocument>(User.find(), req.query);
    apiFeature.search().filter().pagination(resultPerPage);

    const users: IUserDocument[] = await apiFeature.query;

    res.status(200).json({
      success: true,
      userCount: users.length,
      users,
    });
  }
);

export const getUserDetails = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    if (!userId) return next(new ErrorHandler("Please provider user id", 400));
    let user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    return res.status(200).json({ user });
  }
);

export const updateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    if (!userId) return next(new ErrorHandler("Please provide userId", 400));
    let user = await User.findById(userId);
    if (!user) return next(new ErrorHandler("Please provide userId", 400));
    user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  }
);

export const deleteUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    if (!userId) return next(new ErrorHandler("Please provide user id", 400));
    await User.findByIdAndDelete(userId);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }
);
