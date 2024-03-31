import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { createNewTeam, getTeamInfo } from "../controllers/team.controller";

const router = express.Router();

router.post("/team", isAuthenticated, createNewTeam);

router.get("/team/:id", getTeamInfo);

export default router;
