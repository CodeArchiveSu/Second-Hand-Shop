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
  getItemByPLZ,
} from "../controller/productsController.js";
import { multerUpload } from "../middleware/multer.js";

const router = express.Router();

router.get("/all", gettingAllProduct);
router.get("/getItem/:PLZ", getItemByPLZ);
router.post("/upload", multerUpload.array("images", 10), upLoadNewItem);
router.post("/update", multerUpload.array("images", 10), updateProduct);
router.post("/delete", deleteProduct);
router.post("/like", likeItem); //like endpoint

// router.get("/:userDisplayName", productbyLocation); //endpoint
router.get("/:_id", productByUserId); //endpoint

export default router;
