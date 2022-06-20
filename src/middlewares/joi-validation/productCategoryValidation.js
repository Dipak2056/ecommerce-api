import Joi from "joi";
import { SHORTSTR, validator } from "./constantValidation.js";
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
