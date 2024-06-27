import express from "express";
import {
  getAllUsers,
  getUserProfile,
  login,
  signup,
  updateUser,
} from "../controller/usersController.js";
import { multerUpload } from "../middleware/multer.js";
import JWTAuth from "../middleware/JWTAuth.js";

const router = express.Router();

router.get("/all", getAllUsers);
router.post("/signup", multerUpload.single("avatar"), signup);
// multerUpload.single("avater") 스키마 앞에 이름
router.post("/update", updateUser);
router.post("/login", login);
router.get("/profile", JWTAuth, getUserProfile);

export default router;
