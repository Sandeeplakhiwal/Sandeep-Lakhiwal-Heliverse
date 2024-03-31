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
exports.deleteUser = exports.updateUserInfo = exports.getUserDetails = exports.getAllUsers = exports.createNewUser = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const user_model_1 = require("../models/user.model");
const apiFeature_1 = require("../utils/apiFeature");
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
const stream_1 = require("stream");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = __importDefault(require("cloudinary"));
exports.createNewUser = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, gender, domain, available } = req.body;
    if (!first_name || !last_name || !email || !gender || !domain || !available)
        return next(new errorhandler_1.default("Please enter all fields", 400));
    if (!req.file) {
        return next(new errorhandler_1.default("Please add avatar", 400));
    }
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
    const cloud = yield cloudinary_1.default.v2.uploader.upload(tempFilePath, {
        folder: "users",
    });
    // Delete the temporary file after upload
    fs_1.default.unlinkSync(tempFilePath);
    const user = yield user_model_1.User.create({
        first_name,
        last_name,
        avatar: cloud.url || "",
        email,
        gender,
        domain,
        available,
    });
    return res.status(201).json({
        success: true,
        message: "User created successfully",
        user,
    });
}));
exports.getAllUsers = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const resultPerPage = 10;
    const apiFeature = new apiFeature_1.ApiFeatures(user_model_1.User.find(), req.query);
    apiFeature.search().filter().pagination(resultPerPage);
    const users = yield apiFeature.query;
    res.status(200).json({
        success: true,
        userCount: users.length,
        users,
    });
}));
exports.getUserDetails = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    if (!userId)
        return next(new errorhandler_1.default("Please provider user id", 400));
    let user = yield user_model_1.User.findById(userId);
    if (!user) {
        return next(new errorhandler_1.default("User not found", 404));
    }
    return res.status(200).json({ user });
}));
exports.updateUserInfo = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    if (!userId)
        return next(new errorhandler_1.default("Please provide userId", 400));
    let user = yield user_model_1.User.findById(userId);
    if (!user)
        return next(new errorhandler_1.default("Please provide userId", 400));
    user = yield user_model_1.User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
    });
    return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user,
    });
}));
exports.deleteUser = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    if (!userId)
        return next(new errorhandler_1.default("Please provide user id", 400));
    yield user_model_1.User.findByIdAndDelete(userId);
    return res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
}));
