import express from "express";
import { AdminLogin, AdminRegister } from "../controllers/admin.controller";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/admin/register", upload.single("avatar"), AdminRegister);

router.post("/admin/login", AdminLogin);

export default router;
