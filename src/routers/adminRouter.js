import express from "express";
import { encryptPassword, verifyPassword } from "../helpers/bcrypthelper.js";
import {
  emailVerificationValidation,
  loginValidation,
  newAdminValidation,
  updateAdminValidation,
  updatePasswordValidation,
} from "../middlewares/joi-validation/adminValidation.js";
import {
  getAdmin,
  insertAdmin,
  updateAdmin,
} from "../models/admin/Admin.models.js";
import { v4 as uuidv4 } from "uuid";
import {
  OTPNotification,
  profileUpdateNotification,
  sendMail,
} from "../helpers/emailHelper.js";
import { createOtp } from "../helpers/randomGeneratorHelper.js";
import {
  deleteSession,
  insertSession,
} from "../models/session/sessionModel.js";
import {
  createJWTs,
  signAccessJwt,
  verifyRefreshJwt,
} from "../helpers/jwtHelper.js";

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

    if (user.status === "inactive")
      return res.json({
        status: "error",
        message:
          "your account is not active yet, please check your email and follow the instruction to activate your account.",
      });
    if (user?._id) {
      console.log(user);
      //if user exist compare password
      const isMatched = verifyPassword(password, user.password);
      if (isMatched) {
        user.password = undefined;
        user.refreshJWT = undefined;
        const jwts = await createJWTs({ email: user.email });
        res.json({
          status: "success",
          message: "User logged in successfully",
          user,
          ...jwts,
        });
        return;
      }
    }

    res.status(401).json({
      status: "error",
      message: "Invalid login credentials",
    });
  } catch (error) {
    console.log(error);
    error.status = 500;
    next(error);
  }
});

//put method for the update admin profile
router.put("/", updateAdminValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await getAdmin({ email });

    if (user?._id) {
      const isMatched = verifyPassword(password, user.password);
      if (isMatched) {
        const { _id, password, ...rest } = req.body;
        const updatedAdmin = await updateAdmin({ _id }, rest);
        if (updatedAdmin?._id) {
          profileUpdateNotification({
            fName: updatedAdmin.fName,
            email: updatedAdmin.email,
          });
          return res.json({
            status: "success",
            message: "Your profile has been updated successfully",
            user: updatedAdmin,
          });
        }
      }
    } else {
      res.json({
        status: "error",
        message: "Invalid request, Your profile didnot get updated",
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
//=====================password reset otp request
router.post("/otp-request", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email) {
      //check if user exist
      const user = await getAdmin({ email });
      if (user?._id) {
        //create otp and send email
        const obj = {
          token: createOtp(),
          associate: email,
          type: "updatePassword",
        };
        const result = await insertSession(obj);
        if (result?._id) {
          console.log(result);
          res.json({
            status: "success",
            message:
              "If your email exixt in our system, you will send you OTP. Please check your email.",
          });
          //send the otp to the admin email
          return OTPNotification({
            token: result.token,
            email,
          });
        }
        console.log(result);
      }
    }
    res.json({
      status: "error",
      message: "invalid request",
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

//======================reset Password
router.patch("/password", updatePasswordValidation, async (req, res, next) => {
  try {
    const { otp, email, password } = req.body;
    console.log(req.body);
    //1. get session info based in the otp, so that we get the use email
    const session = await deleteSession({ otp, email });
    console.log(session);
    if (session?._id) {
      const update = {
        password: encryptPassword(password),
      };
      const updatedUser = await updateAdmin({ email }, update);
      if (updatedUser?._id) {
        //send the email notificaition
        profileUpdateNotification({
          fName: updatedUser.fName,
          email: updatedUser.email,
        });

        return res.json({
          status: "success",
          message: "your password has been updated",
        });
      }
    }
    res.json({
      status: "error",
      message: "password didnot update successfully.",
    });

    //2. based in the email update update password in the database after encrypting
  } catch (error) {
    error.status = 500;
    next(error);
  }
});
//===========update password
router.patch("/update-password", async (req, res, next) => {
  try {
    const { currentPass, email, password } = req.body;
    console.log(req.body);
    const user = await getAdmin({ email });
    console.log(user);
    if (user?._id) {
      const isMatched = verifyPassword(currentPass, user.password);
      if (isMatched) {
        const hashPassword = encryptPassword(req.body.password);

        const updatedUser = await updateAdmin(
          { _id: user._id },
          { password: hashPassword }
        );
        if (updatedUser?._id) {
          profileUpdateNotification({
            fName: updatedUser.fName,
            email: updatedUser.email,
          });
          return res.json({
            status: "success",
            message: "successfully updated the password",
          });
        }
      }
    }

    res.json({
      status: "error",
      message: "password didnot update successfully.",
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

router.get("/accessjwt", async (req, res, next) => {
  try {
    const refreshJWT = req.headers.authorization;

    const decoded = verifyRefreshJwt(refreshJWT);
    if (decoded?.email) {
      //check refJWT valid and exist in db
      const user = await getAdmin({ email: decoded.email, refreshJWT });
      if (user?._id) {
        //create new access jwt and retur in
        const accessJWT = await signAccessJwt({ email: decoded.email });
        res.json({
          status: "success",
          accessJWT,
        });
      }
    }
    res.status(401).json({
      status: "error",
      message: "log out user.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
