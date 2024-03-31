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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMockData = void 0;
const heliverse_mock_data_1 = require("../heliverse_mock_data");
const user_model_1 = require("../models/user.model");
const catchAsyncError_1 = require("../middleware/catchAsyncError");
exports.AddMockData = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const docs = heliverse_mock_data_1.Mock_data;
    yield user_model_1.User.insertMany(docs);
    return res.status(200).json({
        success: true,
        message: "Mock data inserted successfully",
    });
}));
