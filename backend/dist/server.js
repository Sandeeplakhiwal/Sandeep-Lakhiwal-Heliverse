"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const cloudinary_1 = __importDefault(require("cloudinary"));
// Handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log("Error", err.message);
    console.log("Shutting down the server due to uncaught exception");
    process.exit(1);
});
// Connecting to database
(0, db_1.connectDB)();
// Cloudinary configuration
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLD_NAME,
    api_key: process.env.CLD_API_KEY,
    api_secret: process.env.CLD_API_SECRET,
});
const server = app_1.default.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});
process.on("unhandledRejection", (err) => {
    console.log("Error: ", err.message);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(() => {
        process.exit(1);
    });
});
