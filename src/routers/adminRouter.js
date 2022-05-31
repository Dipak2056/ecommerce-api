import express from "express";
import { encryptPassword } from "../../helpers/bcrypthelper.js";
import {
  emailVerificationValidation,
  newAdminValidation,
} from "../middlewares/joi-validation/adminValidation.js";
import { insertAdmin, updateAdmin } from "../models/admin/Admin.models.js";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "../../helpers/emailHelper.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "GET method hit to admin router",
  });
});

router.post("/", newAdminValidation, async (req, res, next) => {
  try {
    const hashPassword = encryptPassword(req.body.password);
    req.body.password = hashPassword;
    //create uniq email validation code
    req.body.emailValidationCode = uuidv4();

    const result = await insertAdmin(req.body);
    console.log(result);

    if (result?._id) {
      //create unique url and send it to the use email
      const url = `${process.env.ROOT_URL}/admin/verify-email/?c=${result.emailValidationCode}&e=${result.email}`;
      sendMail({ fName: result.fName, url });
      res.json({
        status: "success",
        message: "new admin created successfully",
        hashPassword,
      });
    } else {
      res.json({
        status: "Error",
        message: "new admin creation caused some error",
      });
    }
  } catch (error) {
    if (error.message.includes("E11000 duplicate key")) {
      error.message = "Email already exists, please use another Email";
      error.status = 200;
    }
    error.status = 500;
    next(error);
  }
});
//email verification router
router.post(
  "/email-verification",
  emailVerificationValidation,
  async (req, res) => {
    console.log(req.body);
    const filter = req.body;
    const update = { status: "active" };
    const result = await updateAdmin(filter, update);
    result?._id
      ? res.json({
          status: "success",
          message: "your email successfully verified, You may Login now.",
        })
      : res.json({
          status: "error",
          message: "INvalid or expired verification link.",
        });
  }
);

router.patch("/", (req, res) => {
  res.json({
    status: "error",
    message: "Error creating new user.",
  });
});
export default router;
