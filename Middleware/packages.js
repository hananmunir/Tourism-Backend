import multer from "multer";
import { validateDate } from "../Validators/posts.js";

// multer to handle files
export const upload = multer({ dest: "uploads/" });

// handling validation of date
export const validatePost = (req, res, next) => {
  const { date } = req.body;

  req.body.date = new Date(date);

  // if (!validateDate(date)) {
  //   console.log("Inavalid Date");
  //   return res.status(409).json({ message: "Invalid Date" });
  // }
  next();
};

export const removeUndefined = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "undefined") {
      delete req.body[key];
    }
  });

  next();
};
