import likedItemModel from "../models/likeItemModel.js";

export const getFavoriteItemByUser = async (req, res) => {
  console.log(req);
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
