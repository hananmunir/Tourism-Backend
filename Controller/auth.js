import User from "../Models/users.js";
import jwt from "jsonwebtoken";
import _ from "lodash";
import dotenv from "dotenv";
import bycrpt from "bcryptjs";
import { createError } from "../utils/error.js";

dotenv.config();

// authentication user
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // check if user exists
    const existingUser = await User.findOne({ email });

    //user doesn't exist
    if (!existingUser) return next(createError(404, "User not found"));

    //check credentials
    const passwordCorrect = await bycrpt.compare(
      password,
      existingUser.password
    );

    //password doesnt match
    if (!passwordCorrect) return next(createError(401, "Password incorrect"));

    //create token
    const token = jwt.sign({ _id: existingUser._id }, process.env.SECRET);

    //return user
    res
      .status(200)
      .json({ token, user: _.pick(existingUser, ["name", "email", "role"]) });
  } catch (error) {
    next(error);
  }
};

// register user
export const signUp = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return next(createError(400, "User already exists"));
  }

  //create a new user object
  const newUser = new User({
    name: `${
      firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
    } ${lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()}`,
    email,
    password,
  });

  await newUser.encryptPass();
  // store user in database
  try {
    await newUser.save();

    res.status(200).json(_.pick(newUser, ["name", "email"]));
  } catch (error) {
    next(error);
  }
};

// //delete a user account
// export const deleteUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     //check if id exists
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(404).json({ message: "Object Not Found" });
//     }

//     //delete user
//     await User.findByIdAndRemove(id);

//     res.status(200).json({ message: "User Deleted" });
//   } catch (error) {
//      next(error)
//   }
// };
// //update user info
// export const updateUser = async (req, res) => {};
