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
exports.getTeamInfo = exports.createNewTeam = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
const admin_model_1 = require("../models/admin.model");
const team_model_1 = require("../models/team.model");
exports.createNewTeam = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { name, domain, users } = req.body;
    if (!name || !domain)
        return next(new errorhandler_1.default("Name and domain are required", 400));
    if (users.length === 0)
        return next(new errorhandler_1.default("Team should have atleast one user", 409));
    const admin = yield admin_model_1.Admin.findById((_a = req.admin) === null || _a === void 0 ? void 0 : _a.id).populate("teams");
    if ((admin === null || admin === void 0 ? void 0 : admin.teams.length) !== 0) {
        admin === null || admin === void 0 ? void 0 : admin.teams.map((team) => {
            if (team.domain === domain) {
                return next(new errorhandler_1.default(`You have already a team in ${domain} domain`, 409));
            }
        });
    }
    const newTeam = yield team_model_1.Team.create({
        name,
        domain,
        users,
        admin: (_b = req.admin) === null || _b === void 0 ? void 0 : _b.id,
    });
    return res.status(200).json({ success: true, newTeam });
}));
exports.getTeamInfo = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const teamId = req.params.id;
    if (!teamId)
        return next(new errorhandler_1.default("Team id is required", 400));
    const team = yield team_model_1.Team.findById(teamId).populate("users");
    return res.status(200).json({
        success: true,
        team,
    });
}));
