import express from "express";
import { isLogin } from "../middleware/auth.middleware.js";
import {
  forgotPassword,
  getMe,
  login,
  logOutUser,
  resetPassword,
  userRegister,
  verifyUser,
} from "../controller/user.controller.js";
const router = express.Router();
router.post("/register", userRegister);
router.get("/verify/:token", verifyUser);
router.post("/login", login);
router.get("/profile", isLogin, getMe);
router.get("/logout", isLogin, logOutUser);
router.get("/forgotpassword", isLogin, forgotPassword);
router.post("/resetpassword/:token", isLogin, resetPassword);

export default router;
