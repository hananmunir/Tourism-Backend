import express from "express";
import { signIn, signUp } from "../Controller/auth.js";
import { getUsers } from "../Controller/users.js";
import { isEmailValid } from "../Middleware/auth.js";
//router
const router = express.Router();

//routes
router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/", getUsers);
// router.patch("/:id", updateUser);
// router.delete("/:id", deleteUser);

export default router;
