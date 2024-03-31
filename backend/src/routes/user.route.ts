import express from "express";
import {
  createNewUser,
  getAllUsers,
  getUserDetails,
  updateUserInfo,
} from "../controllers/user.controller";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/users", getAllUsers);

router.get("/users/:id", getUserDetails);

router.post("/users", upload.single("avatar"), createNewUser);

router.put("/users/:id", updateUserInfo);

export default router;
