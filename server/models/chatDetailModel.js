import mongoose from "mongoose";

const { Schema } = mongoose;

const chatDetailSchema = new Schema(
  {
    chatUserId: { type: Schema.Types.ObjectId, ref: "users", require: true },
    chatUserName: { type: String, require: true },
    message: { type: String, ref: "comments", require: true },
  },
  { timestamps: true }
);

const chatDetailModel = mongoose.model("comments", chatDetailSchema);

export default chatDetailModel;
