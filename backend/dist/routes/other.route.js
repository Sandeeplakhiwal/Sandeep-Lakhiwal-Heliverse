"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const other_controller_1 = require("../controllers/other.controller");
const router = express_1.default.Router();
router.post("/add-mock-data", other_controller_1.AddMockData);
exports.default = router;
