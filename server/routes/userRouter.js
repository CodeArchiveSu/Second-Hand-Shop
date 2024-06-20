import express from "express";
import {
  getAllUsers,
  signup,
  updateUser,
} from "../controller/usersController.js";
import { multerUpload } from "../middleware/multer.js";

const router = express.Router();

router.get("/all", getAllUsers);
router.post("/signup", multerUpload.single("avatar"), signup);
// multerUpload.single("avater") 스키마 앞에 이름
router.post("/update", updateUser);

export default router;
