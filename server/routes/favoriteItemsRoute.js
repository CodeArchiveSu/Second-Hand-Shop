import express from "express";
import { multerUpload } from "../middleware/multer.js";
import {
  getFavoriteItemByUser,
  unlikeItem,
} from "../controller/favoriteItemsController.js";

const router = express.Router();

router.get("/:userId", getFavoriteItemByUser);
router.post("/unlike", unlikeItem);

export default router;
