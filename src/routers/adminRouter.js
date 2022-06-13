import express from "express";
import { encryptPassword, verifyPassword } from "../../helpers/bcrypthelper.js";
import {
  emailVerificationValidation,
  loginValidation,
  newAdminValidation,
} from "../middlewares/joi-validation/adminValidation.js";
import {
  getAdmin,
  insertAdmin,
  updateAdmin,
} from "../models/admin/Admin.models.js";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "../../helpers/emailHelper.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "GET method hit to admin router",
  });
});
//new Admin registration
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
    if (result?._id) {
      res.json({
        status: "success",
        message: "your email successfully verified, You may Login now.",
      });
      await updateAdmin(filter, { emailValidationCode: "" });
      return;
    }
    res.json({
      status: "Error",
      message: "Invalid validation or Validation code expired.",
    });
  }
);

//login admin user with email and password
//this feature is not yet completed
router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //check for the authentication.
    console.log(req.body);
    //query get user by email
    const user = await getAdmin({ email });

    if (user.status === "inactive") return;
    res.json({
      status: "error",
      message:
        "your account is not active ye, please check your email and follow the instruction to activate your account.",
    });
    if (user?._id) {
      console.log(user);
      //if user exist compare password
      const isMatched = verifyPassword(password, user.password);
      console.log(isMatched);
      user.password = undefined;

      //for now
      res.json({
        status: "success",
        message: "User logged in successfully",
        user,
      });
      //if match, process for creating jwt and etc for future
      //for now send login success message with user data
      return;
    }

    res.status(401).json({
      status: "success",
      message: "Invalid login credentials",
    });
  } catch (error) {
    console.log(error);
    error.status = 500;
    next(error);
  }
});

export default router;
