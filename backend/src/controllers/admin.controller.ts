import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorhandler";
import { Readable } from "stream";
import path from "path";
import os from "os";
import fs from "fs";
import cloudinary from "cloudinary";
import { Admin } from "../models/admin.model";
import { sendToken } from "../utils/sendToken";

export const AdminRegister = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password)
      return next(new ErrorHandler("Please enter all fields", 400));
    let cloud = { public_id: "", url: "" };

    if (req.file) {
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
      cloud = await cloudinary.v2.uploader.upload(tempFilePath, {
        folder: "users",
      });

      // Delete the temporary file after upload
      fs.unlinkSync(tempFilePath);
    }

    const admin = await Admin.create({
      first_name,
      last_name,
      email,
      password,
      avatar: {
        public_id: cloud.public_id,
        url: cloud.url,
      },
    });

    return sendToken(res, admin, "Admin registered successfully", 201);
  }
);

export const AdminLogin = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }
    let admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return next(new ErrorHandler("Incorrect email or password", 401));
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Incorrect email or password", 401));
    }
    return sendToken(res, admin, `Welcome back ${admin.first_name}`, 200);
  }
);
