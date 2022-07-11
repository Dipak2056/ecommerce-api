import jwt from "jsonwebtoken";
import { updateAdmin } from "../models/admin/Admin.models.js";
import { insertSession } from "../models/session/sessionModel.js";

export const signAccessJwt = async (payload) => {
  const accessJWT = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const obj = {
    token: accessJWT,
    type: "jwt",
  };
  await insertSession(obj);
  return accessJWT;
};
export const signRefreshJwt = async (payload) => {
  const refreshJWT = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "15m",
  });

  await updateAdmin({ email: payload.email }, { refreshJWT });
  return refreshJWT;
};

export const createJWTs = async (payload) => {
  return {
    accessJWT: await signAccessJwt(payload),
    refreshJWT: await signRefreshJwt(payload),
  };
};

export const verifyAccessJwt = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};
