import Joi from "joi";
import {
  LONGSTR,
  SHORTSTR,
  validator,
  PRICE,
  DATE,
  QTY,
} from "./constantValidation.js";
export const newCategoryValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      _id: SHORTSTR.allow(""),
      parentCatId: SHORTSTR.allow(null, ""),
      catName: SHORTSTR.required(),
      status: SHORTSTR.required(),
    });
    validator(schema, req, res, next);
  } catch (error) {
    next(error);
  }
};
export const newProductValidation = (req, res, next) => {
  try {
    req.body.salesEndDate =
      req.body.salesEndDate === "null" ? null : req.body.salesEndDate;
    req.body.salesStartDate =
      req.body.salesStartDate === "null" ? null : req.body.salesStartDate;
    const schema = Joi.object({
      _id: SHORTSTR.allow(""),
      status: SHORTSTR,
      name: SHORTSTR.required(),
      sku: SHORTSTR.required(),
      description: LONGSTR.required(),
      qty: QTY.required(),
      price: PRICE.required(),
      salesPrice: PRICE,
      salesStartDate: DATE.allow(null),
      salesEndDate: DATE.allow(null),
      catId: SHORTSTR.required(),
    });
    validator(schema, req, res, next);
  } catch (error) {
    next(error);
  }
};
export const updateProductValidation = (req, res, next) => {
  try {
    req.body.salesEndDate =
      req.body.salesEndDate === "null" ? null : req.body.salesEndDate;
    req.body.salesStartDate =
      req.body.salesStartDate === "null" ? null : req.body.salesStartDate;
    const schema = Joi.object({
      _id: SHORTSTR.required(),
      status: SHORTSTR.required(),
      name: SHORTSTR.required(),
      description: LONGSTR.required(),
      qty: QTY.required(),
      price: PRICE.required(),
      salesPrice: PRICE,
      salesStartDate: DATE.allow(null),
      salesEndDate: DATE.allow(null),
      catId: SHORTSTR.required(),
      images: LONGSTR.allow(null, ""),
      thumbnail: SHORTSTR.allow(null, ""),
      imgToDelete: LONGSTR.allow(null, ""),
    });
    validator(schema, req, res, next);
  } catch (error) {
    next(error);
  }
};
