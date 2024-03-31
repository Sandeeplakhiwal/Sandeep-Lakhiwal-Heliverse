import { compare, hash } from "bcryptjs";
import mongoose, { Document, Types } from "mongoose";
import Validator from "validator";
import jwt from "jsonwebtoken";

interface IAvatar {
  public_id: string;
  url: string;
}

export interface IAdminDocument extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  avatar: IAvatar;
  teams: Types.ObjectId[];
  created_at: Date;
  generateToken: () => Promise<string>;
  comparePassword: (password: string) => Promise<Boolean>;
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

// Hashing password before saving into database
adminSchema.pre<IAdminDocument>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hash(this.password, 10);
  next();
});

// Generate JWT token
adminSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id }, `${process.env.JWT_SECRET}`, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Comparing admin password
adminSchema.methods.comparePassword = async function (password: string) {
  return await compare(password, this.password);
};

export const Admin = mongoose.model("Admin", adminSchema);
