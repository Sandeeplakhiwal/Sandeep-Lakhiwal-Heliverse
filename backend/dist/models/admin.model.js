"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const bcryptjs_1 = require("bcryptjs");
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
// Hashing password before saving into database
adminSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = yield (0, bcryptjs_1.hash)(this.password, 10);
        next();
    });
});
// Generate JWT token
adminSchema.methods.generateToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign({ _id: this._id }, `${process.env.JWT_SECRET}`, {
            expiresIn: process.env.JWT_EXPIRE,
        });
    });
};
// Comparing admin password
adminSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, bcryptjs_1.compare)(password, this.password);
    });
};
exports.Admin = mongoose_1.default.model("Admin", adminSchema);
