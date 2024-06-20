import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: { type: String, require: true }, // String is shorthand for {type: String}
    price: { type: Number, require: true },
    images: {
      type: [String],
      default: [
        "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg",
      ],
    },
    categorie: { type: String, require: true },
    userId: { type: String, require: true },
    userDisplayName: { type: String, require: true },
    longtitude: { type: String, require: true },
    latitude: { type: String, require: true },
    description: { type: String, require: true },
    comments: [{ type: Array, date: Date }],
    likes: Number,
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;
