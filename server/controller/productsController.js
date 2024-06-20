import ProductModel from "../models/productModel.js";
import { imageUpload } from "../utils/imageManagment.js";

//생아이템추가
const upLoadNewItem = async (req, res) => {
  console.log(req);
  try {
    if (!req.body.title || !req.body.price || !req.body.category) {
      res.status(400).json({ erorr: "please fill the form" });
      req.files.forEach((file) => {
        removeTempFile(file);
      });
      return;
    }
    const newProduct = await ProductModel.create(req.body);

    if (req.file) {
      const [productURL, public_id] = await imageUpload(
        req.file,
        "productImages"
      ).then(console.log("됨"));
      newProduct.images = { url: [productURL], public_id: public_id }; // newUser.avatar를 객체로 설정
    }

    res.status(200).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).sjon({ error: "Server Erorr" });
  } finally {
    req.files.forEach((file) => {
      removeTempFile(file);
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updateProduct = await ProductModel.findByIdAndUpdate(req.body._id, {
      ...req.body,
    });

    res.status(200).json(updateProduct);
  } catch (error) {
    console.log(error);
  }
};

const gettingAllProduct = async (req, res) => {
  const allProducts = await ProductModel.find({});
  // console.log(allProducts);

  res.status(200).json({
    number: allProducts.length,
    allProducts,
  });
};

//ㅁㅣ디어쿼리 만드는방법
const productbyLocation = async (req, res) => {
  console.log(req);
  const userName = req.params.userDisplayName;
  const likes = req.query.likes;

  if (likes) {
    try {
      const allProducts = await ProductModel.find({
        userDisplayName: userName,
        likes: { $gte: likes },
      }).exec();

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
      const Products = await ProductModel.find({ userDisplayName: userName });
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
export { updateProduct, upLoadNewItem, gettingAllProduct, productbyLocation };
