import express from "express";
import { AddMockData } from "../controllers/other.controller";

const router = express.Router();

router.post("/add-mock-data", AddMockData);

export default router;
