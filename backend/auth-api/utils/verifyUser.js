import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized."));
  }
  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized."));
    }
    req.user = user;
    next();
  });
};
