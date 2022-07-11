import jwt from "jsonwebtoken";
import { insertSession } from "../models/session/sessionModel.js";

export const signAccessJwt = (payload) => {
  const accessJWT = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const obj = {
    token: accessJWT,
    type: "jwt",
  };
  return insertSession(obj);
};
export const verifyAccessJwt = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};
