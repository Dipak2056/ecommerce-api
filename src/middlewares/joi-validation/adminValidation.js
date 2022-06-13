import Joi from "joi";
import {
  FNAME,
  LNAME,
  PHONE,
  DOB,
  EMAIL,
  ADDRESS,
  PASSWORD,
  REQUIREDSTR,
  validator,
} from "./constantValidation.js";
// const fName = Joi.string().alphanum().required().min(3).max(20);
// const lName = Joi.string().alphanum().required().min(3).max(20);
// const email = Joi.string().email({ minDomainSegments: 2 }).required();
// const phone = Joi.string().required().min(10).max(15);
// const dob = Joi.date().allow(null);
// const address = Joi.string().allow(null).allow("");
// const password = Joi.string().required();
// const requiredStr = Joi.string().required();

export const newAdminValidation = (req, res, next) => {
  const schema = Joi.object({
    fName: FNAME,
    lName: LNAME,
    email: EMAIL,
    phone: PHONE,
    dob: DOB,
    address: ADDRESS,
    password: PASSWORD,
  });
  validator(schema, req, res, next);
};

export const emailVerificationValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL,
    emailValidationCode: REQUIREDSTR,
  });
  validator(schema, req, res, next);
};
export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL,
    password: PASSWORD,
  });
  validator(schema, req, res, next);
};
