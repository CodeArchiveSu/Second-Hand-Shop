import express from "express";
import { multerUpload } from "../middleware/multer.js";
import { getFavoriteItemByUser } from "../controller/favoriteItemsController.js";
import {
  chatRequest,
  createNewRoom,
  getChatRooms,
  sendMessage,
  updateMessage,
} from "../controller/chatRoomController.js";

const router = express.Router();

router.post("/newRoom", createNewRoom);
router.get("/request/:chatId", chatRequest);
router.get("/:userId", getChatRooms);
router.post("/sendMessage", sendMessage);
router.post("/updateMessage", updateMessage);

export default router;
