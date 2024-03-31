"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.get("/users", user_controller_1.getAllUsers);
router.get("/users/:id", user_controller_1.getUserDetails);
router.post("/users", upload.single("avatar"), user_controller_1.createNewUser);
router.put("/users/:id", user_controller_1.updateUserInfo);
router.delete("/users/:id", user_controller_1.deleteUser);
exports.default = router;
