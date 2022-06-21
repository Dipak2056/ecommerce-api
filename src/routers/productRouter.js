import express from "express";
import slugify from "slugify";
import { newProductValidation } from "../middlewares/joi-validation/productCategoryValidation.js";
import {
  deleteMultipleProducts,
  getMultipleProducts,
  insertProduct,
} from "../models/product/Product.model.js";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await getMultipleProducts();
    res.json({
      status: "success",
      message: "Product lists",
      products,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", newProductValidation, async (req, res, next) => {
  try {
    console.log(req.body);
    const { name } = req.body;
    const slug = slugify(name, { trim: true, lower: true });
    req.body.slug = slug;
    const result = await insertProduct(req.body);
    console.log(slug);
    result?._id
      ? res.json({
          status: "success",
          message: "New Product has been created",
        })
      : res.json({
          status: "error",
          message: "Error! unable to add new product",
        });
  } catch (error) {
    //
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message = "Another product with similar name or SKU already exist.";
      error.status = 200;
    }
    next(error);
  }
});
router.delete("/", async (req, res, next) => {
  try {
    const ids = req.body;
    if (ids.length) {
      const result = await deleteMultipleProducts(ids);
      console.log(result);
      if (result?.deletedCount) {
        return res.json({
          status: "success",
          message: "selected product has been deleted",
        });
      }
    }

    res.json({
      status: "error",
      message: "unable to delete, please try again later",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
