import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      default: "inactive",
    },
    name: {
      type: String,
      requierd: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    SKU: {
      type: String,
      unique: true,
      index: 1,
      required: true,
      maxlength: 20,
    },
    description: {
      type: String,
      required: true,
      index: 1,
      required: true,
      maxlength: 500,
    },
    qty: {
      type: String,
    },
    image: [{ type: String, required: true }],
    thumbnail: {
      type: String,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    salesPrice: {
      type: Number,
      default: 0,
    },
    salesDate: {
      type: String,
      default: null,
    },
    ratings: {
      type: Number,
      max: 5,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", ProductSchema);
