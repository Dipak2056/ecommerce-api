import express from "express";
import { newCategoryValidation } from "../middlewares/joi-validation/productCategoryValidation.js";
import {
  deleteCatById,
  getAllCategories,
  insertCategory,
  updateCategoryById,
  getCategories,
} from "../models/category/Category.model.js";

import slugify from "slugify";

const router = express.Router();
//add
router.post("/", newCategoryValidation, async (req, res, next) => {
  try {
    console.log(req.body);
    const slug = slugify(req.body.catName, { lower: true, trim: true });
    console.log(slug);
    const result = await insertCategory({ ...req.body, slug });
    console.log(result);
    result?._id
      ? res.json({ status: "success", message: "New category has been added" })
      : res.json({
          status: "error",
          message: "Unable to add category, try again alater",
        });
  } catch (error) {
    console.log(error);
    error.status = 500;
    if (error.message.includes("E11000 duplicate Key")) {
      error.status = 200;
      error.messaage =
        "This category has already exist please chang the name of new category";
    }
  }
});
//return all active categories
router.get("/", async (req, res, next) => {
  try {
    const result = await getAllCategories();
    res.json({ status: "success", message: "categories result", result });
  } catch (error) {
    next(error);
  }
});
//update status of categories
router.patch("/", async (req, res, next) => {
  try {
    const { _id, status } = req.body;

    if (!_id || !status) {
      throw new Error("invalid data set");
    }
    const result = await updateCategoryById(_id, { status });
    result?._id
      ? res.json({ status: "success", message: "categories result", result })
      : res.json({ status: "error", message: "error updating categories" });
  } catch (error) {
    next(error);
  }
});
//update category
router.put("/", newCategoryValidation, async (req, res, next) => {
  try {
    console.log(req.body);
    const { _id, ...rest } = req.body;
    const result = await updateCategoryById(_id, rest);
    console.log(result);
    result?._id
      ? res.json({
          status: "success",
          message: " category has been updated",
        })
      : res.json({
          status: "error",
          message: "Unable to update category, try again alater",
        });
  } catch (error) {
    next(error);
  }
});
//delete
router.delete("/", async (req, res, next) => {
  try {
    const { _id } = req.body;
    const filter = { parentCatId: _id };

    const childCats = getCategories(filter);
    if (childCats.length) {
      return res.json({
        status: "error",
        message:
          "There are more thaan one child component dependent on this parent category. so reallocate those child category to new parent category than proceed.",
      });
    }

    const result = await deleteCatById(_id);
    result?._id
      ? res.json({
          status: "success",
          message: "The Category has been deleted",
        })
      : res.json({
          status: "error",
          message: "The Category has not  been deleted",
        });
  } catch (error) {
    next(error);
  }
});
export default router;
