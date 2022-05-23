import express from "express";
import { signIn, signUp } from "../Controller/auth.js";

import { isEmailValid } from "../Middleware/auth.js";
//router
const router = express.Router();

//routes
router.post("/signin", signIn);
router.post("/signup", isEmailValid, signUp);
// router.patch("/:id", updateUser);
// router.delete("/:id", deleteUser);

export default router;
