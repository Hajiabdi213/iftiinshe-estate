import { Router } from "express";
import {
  signup,
  signin,
  signOut,
  google,
} from "../controllers/auth.controller.js";
const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signOut);

export default router;
