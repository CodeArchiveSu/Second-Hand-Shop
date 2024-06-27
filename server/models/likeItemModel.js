import mongoose from "mongoose";

const { Schema } = mongoose;

const likeItemModel = new Schema(
  {
    likedItemId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      require: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "users", require: true },
    likes: Number,
  },
  { timestamps: true }
);

const likedItemModel = mongoose.model("likedItems", likeItemModel);

export default likedItemModel;
