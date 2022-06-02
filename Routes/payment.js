import express from "express";
import { payment } from "../Controller/payment.js";
import { auth } from "../Middleware/auth.js";
const router = express.Router();

router.post("/", auth, payment);
export default router;
