import Joi from "joi";
import { SHORTSTR, validator } from "./constantValidation.js";
export const newCategoryValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      parentCat: SHORTSTR.allow(""),
      catName: SHORTSTR.required(),
    });
    validator(schema, req, res, next);
  } catch (error) {
    next(error);
  }
};
