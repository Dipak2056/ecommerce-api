import Joi from "joi";
import { SHORTSTR, LONGSTR, validator } from "./constantValidation.js";
// const fName = Joi.string().alphanum().required().min(3).max(20);
// const lName = Joi.string().alphanum().required().min(3).max(20);
// const email = Joi.string().email({ minDomainSegments: 2 }).required();
// const phone = Joi.string().required().min(10).max(15);
// const dob = Joi.date().allow(null);
// const address = Joi.string().allow(null).allow("");
// const password = Joi.string().required();
// const requiredStr = Joi.string().required();

export const newPaymentMethodValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: SHORTSTR.allow(null, ""),
    status: SHORTSTR.required(),
    name: SHORTSTR.required(),
    description: LONGSTR.required(),
  });
  validator(schema, req, res, next);
};
