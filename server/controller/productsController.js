import likedItemModel from "../models/likeItemModel.js";
import ProductModel from "../models/productModel.js";
import productModel from "../models/productModel.js";
import { imageUpload } from "../utils/imageManagment.js";
import { removeTempFile } from "../utils/tempFileManagement.js";
// import { io } from "../server.js"; // Import the io object from server.js

//생아이템추가
// const upLoadNewItem = async (req, res) => {
//   try {
//     if (!req.body.title || !req.body.price || !req.body.category) {
//       res.status(400).json({ erorr: "please fill the form" });
//       req.files.forEach((file) => {
//         removeTempFile(file);
//       });
//       return;
//     }
//     // const newProduct = await ProductModel.create(req.body);
//     const newProduct = new ProductModel(req.body);
//     console.log("여기요", req.files);

//     if (req.files && req.files.length > 0) {
//       const imagePromises = req.files.map((file) =>
//         imageUpload(file, "productImages")
//       );

//       const uploadedImages = await Promise.all(imagePromises);

//       console.log("업로드 이미지들", uploadedImages);

//       // Assume imageUpload returns [productURL, public_id] for each file
//       newProduct.images = uploadedImages.map(([productURL, public_id]) => ({
//         url: productURL,
//         public_id,
//       }));
//       console.log("업로드 이미지들", newProduct.images);
//     }

//     await newProduct.save();

//     res.status(200).json(newProduct);
//   } catch (error) {
//     console.log(error);
//     res.status(500).sjon({ error: "Server Erorr" });
//   } finally {
//     req.files.forEach((file) => {
//       removeTempFile(file);
//     });
//   }
// };

const upLoadNewItem = async (req, res) => {
  console.log(req.files);
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

    const newLikedProduct = new likedItemModel(req.body);
    console.log(req.body);
    await newLikedProduct.save();

    res.status(200).json(newLikedProduct); // Respond with the saved product data
  } catch (error) {
    console.error("Error posting like item:", error);
    res.status(500).json({ error: "Server Error" });
  }
  // const newLikedProduct = new likedItemModel(req.body);
  // res.status(200).json(newProduct);
};

const getLikedItems = async (req, res) => {
  try {
    const update = await likedItemModel
      .find({})
      .populate("likedItemId")
      .populate("userId");
    res.status(200).json(update);
  } catch (erorr) {
    res.status(500).json({ erorr: "Server Erorr" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updateProduct = await productModel.findByIdAndUpdate(req.body._id, {
      ...req.body,
    });

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

    // io.emit("productDeleted", deleteProduct);

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
  // console.log(req);
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
  getLikedItems,
};
