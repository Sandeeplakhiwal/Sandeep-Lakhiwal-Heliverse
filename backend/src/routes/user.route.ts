import express from "express";
import {
  createNewUser,
  deleteUser,
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

router.delete("/users/:id", deleteUser);

export default router;
