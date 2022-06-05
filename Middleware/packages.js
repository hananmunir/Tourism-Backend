import multer from "multer";
import { validateDate } from "../Validators/posts.js";
import { createError } from "../utils/error.js";

// multer to handle files
export const upload = multer({
  dest: "uploads/",

  limits: {
    fileSize: 1024 * 1024,
  },
});

export const checkFileType = (req, res, next) => {
  // check if the file is an image
  const file = req.file;
  console.log(file);
  if (!file) {
    return next(createError(400, "Bad Request, no file uploaded"));
  }
  if (
    file.mimetype !== "image/jpeg" &&
    file.mimetype !== "image/webp" &&
    file.mimetype !== "image/png"
  ) {
    console.log("File Type not supported");
    return next(createError(400, "File type not supported"));
  }
  next();
};
// handling validation of date
export const validatePost = (req, res, next) => {
  const { date } = req.body;
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);

  req.body.departureDate = newDate;
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
