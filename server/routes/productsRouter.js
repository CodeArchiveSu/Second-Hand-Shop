import express from "express";
import ProductModel from "../models/productModel.js";
import {
  gettingAllProduct,
  productbyLocation,
  upLoadNewItem,
  updateProduct,
} from "../controller/productsController.js";
import { multerUpload } from "../middleware/multer.js";

const router = express.Router();

router.get("/all", gettingAllProduct);
router.post("/upload", multerUpload.array("images", 10), upLoadNewItem);
router.post("/update", updateProduct);
router.get("/:userDisplayName", productbyLocation); //endpoint

export default router;
