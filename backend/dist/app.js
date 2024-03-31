"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const app = (0, express_1.default)();
// Configured dotenv path for environment variables
dotenv_1.default.config({
    path: "./src/config/.env",
});
// Using Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log("Error: ", err.message);
    console.log("Shutting down the server due to uncaught exception");
    process.exit(1);
});
app.get("/", (req, res) => {
    res.send("Sandeep Lakhiwal");
});
// Importing Routes
const other_route_1 = __importDefault(require("./routes/other.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
// Using Routes
app.use("/api", other_route_1.default);
app.use("/api", user_route_1.default);
// Usign error middleware for exception handling
app.use(error_middleware_1.default);
exports.default = app;
