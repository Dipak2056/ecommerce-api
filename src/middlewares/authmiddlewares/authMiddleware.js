import { verifyAccessJwt } from "../../helpers/jwtHelper.js";
import { getAdmin } from "../../models/admin/Admin.models.js";
import { getSession } from "../../models/session/sessionModel.js";
export const adminAuth = async (req, res, next) => {
  try {
    //get the access jwt from header
    const { authorization } = req.headers;
    if (authorization) {
      //check if it is valid and not expired
      const decoded = verifyAccessJwt(authorization);
      if (decoded === "jwt expired") {
        return res.status(403).json({
          status: "error",
          message: "jwt expired",
        });
      }

      //check if exist in database
      if (decoded?.email) {
        const existinDb = await getSession({
          type: "jwt",
          token: authorization,
        });

        if (existinDb?._id) {
          const admin = await getAdmin({ email: decoded.email });
          if (admin?._id) {
            req.adminInfo = admin;
            return next();
          }
        }
      }
      //get the user info and attach in the req.body
      res.status(401).json({
        status: "error",
        message: "unauthorized!",
      });
    }
  } catch (error) {
    next(error);
  }
};
