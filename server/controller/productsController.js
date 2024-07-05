import likedItemModel from "../models/likeItemModel.js";
import ProductModel from "../models/productModel.js";
import productModel from "../models/productModel.js";
import { imageUpload } from "../utils/imageManagment.js";
import { removeTempFile } from "../utils/tempFileManagement.js";

const upLoadNewItem = async (req, res) => {
  console.log("uploadnewitem", req.files);
  try {
    if (!req.body.title || !req.body.price) {
      res.status(400).json({ error: "Please fill all required fields" });
      removeTempFile(req.file);
      return;
    }

    const newProduct = new productModel(req.body);

    if (req.files && req.files.length > 0) {
      const imagesUploadPromises = req.files.map(async (file) => {
        const [productURL, public_id] = await imageUpload(
          file,
          "productImages"
        );
        return { url: productURL, public_id: public_id };
      });

      const uploadedImages = await Promise.all(imagesUploadPromises);

      newProduct.images = uploadedImages;
    }

    await newProduct.save();
    // res.status(200).json("testing");
    res.status(200).json(newProduct);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Server Error" });
  } finally {
    removeTempFile(req.file);
  }
};

const likeItem = async (req, res) => {
  try {
    //만약 아이디 없으면 안됨 로그인 포스트 나와야함
    if (!req.body.userId) {
      console.log("Login first");
      return;
    }

    const { likedItemId, userId } = req.body;

    const existing = await likedItemModel.findOne({ userId, likedItemId });

    if (existing) {
      return res.status(400).json({ message: "Item already liked" });
    }

    if (!existing) {
      const newLikedProduct = new likedItemModel(req.body);
      await newLikedProduct.save();
      res.status(200).json(newLikedProduct);
    }
  } catch (error) {
    console.error("Error posting like item:", error);
    res.status(500).json({ error: "Server Error" });
  }
  // const newLikedProduct = new likedItemModel(req.body);
  // res.status(200).json(newProduct);
};

const updateProduct = async (req, res) => {
  console.log("updateProduct", req.body);
  try {
    const updates = {
      ...req.body,
    };
    // upload images into new array

    if (req.files && req.files.length > 0) {
      const imagesUploadPromises = req.files.map(async (file) => {
        const [productURL, public_id] = await imageUpload(
          file,
          "productImages"
        );
        return { url: productURL, public_id: public_id };
      });

      const uploadedImages = await Promise.all(imagesUploadPromises);

      updates.images = uploadedImages;
    }

    const updateProduct = await productModel.findByIdAndUpdate(
      req.body._id,
      updates,
      { new: true }
    );

    res.status(200).json(updateProduct);
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleteProduct = await productModel.findByIdAndDelete(req.body._id, {
      ...req.body,
    });
    if (!deleteProduct) {
      return null;
    }

    res.status(200).json({
      message: "product succesfully deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(401).json({
      message: "product could not deleted",
    });
  }
};

const gettingAllProduct = async (req, res) => {
  const allProducts = await productModel.find({});
  // console.log(allProducts);
  try {
    res.status(200).json({
      number: allProducts.length,
      allProducts,
    });
  } catch (error) {
    console.log(error);
  }
};

//ㅁㅣ디어쿼리 만드는방법
const productbyLocation = async (req, res) => {
  const userName = req.params.userDisplayName;
  const likes = req.query.likes;

  if (likes) {
    try {
      const allProducts = await productModel
        .find({
          userDisplayName: userName,
          likes: { $gte: likes },
        })
        .exec();

      if (allProducts.length == 0) {
        res.status(200).json({
          message: "no products",
        });
        return;
      }

      res.status(200).json({
        number: allProducts.length,
        allProducts,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "something went wrong",
      });
    }
  }

  if (!likes) {
    try {
      const Products = await productModel.find({ userDisplayName: userName });
      res.status(200).json({
        number: Products.length,
        Products,
      });
    } catch (erorr) {
      console.log(erorr);
      res.status(400).json({
        message: "something went wrong",
      });
    }
  }
};

const productByUserId = async (req, res) => {
  const userId = req.params._id;
  console.log(req.params);
  try {
    const Products = await ProductModel.find({ userId: userId });

    res.status(200).json({
      number: Products.length,
      Products,
    });
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
    });
  }
};

export {
  productByUserId,
  updateProduct,
  upLoadNewItem,
  gettingAllProduct,
  productbyLocation,
  deleteProduct,
  likeItem,
};
