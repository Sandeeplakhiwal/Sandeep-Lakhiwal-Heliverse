"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
// Connecting to database
(0, db_1.connectDB)();
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
