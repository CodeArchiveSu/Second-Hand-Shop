import express from "express";
import { multerUpload } from "../middleware/multer.js";
import { getFavoriteItemByUser } from "../controller/favoriteItemsController.js";

const router = express.Router();

router.get("/:userId", getFavoriteItemByUser);

export default router;
