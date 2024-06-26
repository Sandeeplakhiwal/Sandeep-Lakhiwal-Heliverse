import mongoose, { Document, Schema } from "mongoose";
import Validator from "validator";

export interface IUserDocument extends Document {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  avatar: string;
  domain: string;
  available: boolean;
}

export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  avatar: string;
  domain: string;
  available: boolean;
}

const userSchema: Schema<IUserDocument> = new mongoose.Schema({
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
  gender: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
});

export const User = mongoose.model("User", userSchema);
