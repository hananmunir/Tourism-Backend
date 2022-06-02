import { validateEmail } from "../Validators/users.js";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { createError } from "../utils/error.js";
import User from "../Models/users.js";

export const auth = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return next(createError(401, "Unauthorized Request"));

  try {
    const id = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(id);
    if (!user) return next(createError(404, "User not found"));
    req.user = _.pick(user, ["name", "email", "role", "_id"]);
  } catch (error) {
    next(error);
  }
  next();
};

// validating user data
export const isEmailValid = (req, res, next) => {
  const { email } = req.body.user;

  if (!validateEmail(email)) {
    return next(createError(409, "Invalid Email"));
  }
  next();
};
