import likedItemModel from "../models/likeItemModel.js";

export const getFavoriteItemByUser = async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  try {
    const favoritItems = await likedItemModel
      .find({ userId: userId })
      .populate("likedItemId")
      .populate("userId");
    res.status(200).json({
      favoriteItems: favoritItems,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "couldn't find liked items",
    });
  }
};

export const unlikeItem = async (req, res) => {
  console.log(req.body);
  try {
    const filter = { likedItemId: req.body._id, userId: req.body.userId };

    const unlikeProduct = await likedItemModel.findOneAndDelete(filter);

    if (!unlikeProduct) {
      console.log("해당아이템없음");
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

// const test = async (req, res) => {
//   // const userId = req;
//   console.log("Testing");
//   // try {
//   //   const update = await likedItemModel
//   //     .find({})
//   //     .populate("likedItemId")
//   //     .populate("userId");
//   //   res.status(200).json(update);
//   // } catch (erorr) {
//   //   res.status(500).json({ erorr: "Server Erorr" });
//   // }
// };

// export { getFavoriteItemByUser };
