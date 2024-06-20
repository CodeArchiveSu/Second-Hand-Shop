import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userDisplayName: { type: String, require: true },
    avatar: {
      public_id: { type: String },
      url: { type: String, default: "heart-157895_1280.png" },
    },
    // longtitude: { type: String, require: true },
    // latitude: { type: String, require: true },
    // city: { type: String, require: true },
    comments: [{ type: Array, date: Date }],
    items: [{ type: Schema.Types.ObjectId, ref: "products" }], //products로가서 찾아라
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
