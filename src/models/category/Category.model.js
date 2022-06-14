import CategorySchema from "./Category.schema.js";

export const insertCategory = (obj) => {
  return CategorySchema(obj).save();
};
export const getAllCategory = (filter) => {
  return CategorySchema.findOne(filter);
};
export const getCategories = (filter) => {
  return CategorySchema.find(filter);
};

export const deleteCatById = (_id) => {
  return CategorySchema.findByIdAndDelete(_id);
};
//@updateObj must be an type of object
export const updateCategoryById = (_id, updateObj) => {
  return CategorySchema.findByIdAndUpdate(_id, updateObj);
};
