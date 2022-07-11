import jwt from "jsonwebtoken";
import { insertSession } from "../models/session/sessionModel.js";

export const signAccessJwt = async (payload) => {
  const accessJWT = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const obj = {
    token: accessJWT,
    type: "jwt",
  };
  const result = await insertSession(obj);
  return;
};
export const verifyAccessJwt = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};
