import express from "express";
import { newCategoryValidation } from "../middlewares/joi-validation/productCategoryValidation.js";
import {
  getAllCategories,
  insertCategory,
  updateCategoryById,
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
export default router;
