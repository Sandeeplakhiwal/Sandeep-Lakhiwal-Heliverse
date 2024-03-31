import mongoose, { Document, Types } from "mongoose";

export interface ITeamDocument extends Document {
  name: string;
  domain: string;
  admin: Types.ObjectId;
  users: Types.ObjectId[];
  created_at: Date;
}

const teamSchema = new mongoose.Schema<ITeamDocument>({
  name: {
    type: String,
    required: true,
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name should have at least two characters"],
  },
  domain: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

export const Team = mongoose.model<ITeamDocument>("Team", teamSchema);
