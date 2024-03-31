"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const adminSchema = new mongoose_1.default.Schema({
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
        validate: [validator_1.default.isEmail, "Please enter a valid email"],
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Team",
        },
    ],
    created_at: {
        type: Date,
        default: Date.now(),
    },
});
exports.Admin = mongoose_1.default.model("Admin", adminSchema);
