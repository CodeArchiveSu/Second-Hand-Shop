import express from "express";
import { multerUpload } from "../middleware/multer.js";
import { getFavoriteItemByUser } from "../controller/favoriteItemsController.js";
import {
  createNewRoom,
  getChatRooms,
} from "../controller/chatRoomController.js";

const router = express.Router();

router.post("/newRoom", createNewRoom);
router.get("/:userId", getChatRooms);

export default router;
