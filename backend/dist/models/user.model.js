"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.default.Schema({
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
exports.User = mongoose_1.default.model("User", userSchema);
/*   {
    id: 1,
    first_name: "Anet",
    last_name: "Doe",
    email: "adoe0@comcast.net",
    gender: "Female",
    avatar: "https://robohash.org/sintessequaerat.png?size=50x50&set=set1",
    domain: "Sales",
    available: false,
  }, */
