import express from "express";
import { newCategoryValidation } from "../middlewares/joi-validation/productCategoryValidation.js";

const router = express.Router();
//add
router.post("/", newCategoryValidation, (req, res, next) => {
  try {
    console.log(req.body);
  } catch (error) {
    console.log(error);
    error.status = 500;
    next(error);
  }
});
export default router;
