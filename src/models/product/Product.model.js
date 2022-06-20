import ProductSchema from "./Product.schema.js";

export const insertProduct = (obj) => {
  return ProductSchema(obj).save();
};
const getProduct = (filter) => {
  return ProductSchema.findOne(filter);
};
const getMultipleProducts = (filter) => {
  return ProductSchema.find(filter);
};
const updateProduct = (filter, updateObj) => {
  return ProductSchema.findByIdAndUpdate(filter, updateObj);
};
const deleteProduct = (filter) => {
  return ProductSchema.findOneAndDelete(filter);
};
