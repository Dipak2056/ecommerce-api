import express from "express";
import { encryptPassword } from "../../helpers/bcrypthelper.js";
import { newAdminValidation } from "../middlewares/joi-validation/adminValidation.js";
import { insertAdmin } from "../models/admin/Admin.models.js";
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
    const result = await insertAdmin(req.body);
    console.log(result);

    result?._id
      ? res.json({
          status: "success",
          message: "new admin created successfully",
          hashPassword,
        })
      : res.json({
          status: "Error",
          message: "new admin creation caused some error",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key")) {
      error.message = "Email already exists, please use another Email";
      error.status = 200;
    }
    error.status = 500;
    next(error);
  }
});

router.patch("/", (req, res) => {
  res.json({
    status: "error",
    message: "Error creating new user.",
  });
});
export default router;
