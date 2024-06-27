import express from "express";
import ProductModel from "../models/productModel.js";
import {
  gettingAllProduct,
  productbyLocation,
  upLoadNewItem,
  updateProduct,
  productByUserId,
  deleteProduct,
  likeItem,
  getLikedItems,
} from "../controller/productsController.js";
import { multerUpload } from "../middleware/multer.js";

const router = express.Router();

router.get("/all", gettingAllProduct);
router.post("/upload", multerUpload.array("images", 10), upLoadNewItem);
router.post("/update", updateProduct);
router.post("/delete", deleteProduct);
router.post("/like", likeItem); //like endpoint
router.get("/getLikedItems/", getLikedItems);
// router.get("/:userDisplayName", productbyLocation); //endpoint
router.get("/:_id", productByUserId); //endpoint

export default router;
