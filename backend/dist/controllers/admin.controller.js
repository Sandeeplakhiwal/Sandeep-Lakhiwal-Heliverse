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
exports.AdminLogin = exports.AdminRegister = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
const stream_1 = require("stream");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const admin_model_1 = require("../models/admin.model");
const sendToken_1 = require("../utils/sendToken");
exports.AdminRegister = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password)
        return next(new errorhandler_1.default("Please enter all fields", 400));
    let cloud = { public_id: "", url: "" };
    if (req.file) {
        // Create a Readable stream for buffer
        const bufferStream = new stream_1.Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null); // Signals the end of the stream
        // Create a temporary file path
        const tempFilePath = path_1.default.join(os_1.default.tmpdir(), `${req.file.originalname}`);
        // Create a WriteStream to write the Buffer data to the temporary file
        const writeStream = fs_1.default.createWriteStream(tempFilePath);
        bufferStream.pipe(writeStream);
        // Wait for the stream to finish writing to the file
        yield new Promise((resolve, reject) => {
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
        });
        // Upload the temporary file to Cloudinary
        cloud = yield cloudinary_1.default.v2.uploader.upload(tempFilePath, {
            folder: "users",
        });
        // Delete the temporary file after upload
        fs_1.default.unlinkSync(tempFilePath);
    }
    const admin = yield admin_model_1.Admin.create({
        first_name,
        last_name,
        email,
        password,
        avatar: {
            public_id: cloud.public_id,
            url: cloud.url,
        },
    });
    return (0, sendToken_1.sendToken)(res, admin, "Admin registered successfully", 201);
}));
exports.AdminLogin = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new errorhandler_1.default("Please enter all fields", 400));
    }
    let admin = yield admin_model_1.Admin.findOne({ email }).select("+password");
    if (!admin) {
        return next(new errorhandler_1.default("Incorrect email or password", 401));
    }
    const isMatch = yield admin.comparePassword(password);
    if (!isMatch) {
        return next(new errorhandler_1.default("Incorrect email or password", 401));
    }
    return (0, sendToken_1.sendToken)(res, admin, `Welcome back ${admin.first_name}`, 200);
}));
