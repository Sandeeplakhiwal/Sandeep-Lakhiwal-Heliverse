import mongoose, { Document, Types } from "mongoose";
import Validator from "validator";

interface IAvatar {
  public_id: string;
  url: string;
}

interface IAdminDocument extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  avatar: IAvatar;
  teams: Types.ObjectId[];
  created_at: Date;
}

const adminSchema = new mongoose.Schema<IAdminDocument>({
  first_name: {
    type: String,
    required: [true, "Please enter your first_name"],
    maxLength: [30, "First_name cannot exceed 30 characters"],
    minLength: [2, "First_name should have at least two characters"],
  },
  last_name: {
    type: String,
    required: [true, "Please enter your last_name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name should have at least two characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [Validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    maxLength: [30, "Password cannot exceed 50 characters"],
    minLength: [6, "Password should have at least 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

export const Admin = mongoose.model("Admin", adminSchema);
