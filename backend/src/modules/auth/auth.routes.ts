import { Router } from "express";
import { register, login } from "./auth.controller";
import { adminLogin } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.post(
  "/admin/login",
  adminLogin
);

export default router;