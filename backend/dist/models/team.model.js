"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const teamSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [2, "Name should have at least two characters"],
    },
    domain: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Admin",
    },
    users: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    created_at: {
        type: Date,
        default: Date.now(),
    },
});
exports.Team = mongoose_1.default.model("Team", teamSchema);
