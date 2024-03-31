import { Request, Response } from "express";
import { Mock_data } from "../heliverse_mock_data";
import { User } from "../models/user.model";
import { catchAsyncError } from "../middleware/catchAsyncError";

export const AddMockData = catchAsyncError(
  async (req: Request, res: Response) => {
    const docs = Mock_data;
    await User.insertMany(docs);
    return res.status(200).json({
      success: true,
      message: "Mock data inserted successfully",
    });
  }
);
