"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const team_controller_1 = require("../controllers/team.controller");
const router = express_1.default.Router();
router.post("/team", auth_middleware_1.isAuthenticated, team_controller_1.createNewTeam);
router.get("/team/:id", team_controller_1.getTeamInfo);
exports.default = router;
