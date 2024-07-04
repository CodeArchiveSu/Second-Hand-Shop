import mongoose from "mongoose";

const { Schema } = mongoose;

const chatRoomSchema = new Schema(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      require: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "users", require: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "users", require: true },
    messages: [{ type: Schema.Types.ObjectId, ref: "comments" }],
  },
  { timestamps: true }
);

const chatRoomModel = mongoose.model("chatRoom", chatRoomSchema);

export default chatRoomModel;
