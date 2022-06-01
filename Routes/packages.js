import express from "express";

import {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getImage,
} from "../Controller/packages.js";
import { auth } from "../Middleware/auth.js";
import admin from "../Middleware/admin.js";
import {
  removeUndefined,
  upload,
  validatePost,
} from "../Middleware/packages.js";

//router
const router = express.Router();

// app routes
router.get("/:id", getPost);
router.get("/", getPosts);
// router.post("/", upload.single("image"), auth, admin, validatePost, createPost);
router.post("/", upload.single("image"), validatePost, createPost);
router.patch(
  "/:id",
  upload.single("image"),
  auth,
  admin,
  removeUndefined,
  updatePost
);
router.delete("/:id", auth, admin, deletePost);
//router.delete("/:id", deletePost);
router.get("/images/:id", getImage);

export default router;
