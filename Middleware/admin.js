import { createError } from "../utils/error.js";
const auth = async (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(createError(401, "Unauthorized"));
  }
  next();
};

export default auth;
