// @ts-nocheck
import { Router } from "express";
import * as authControllers from "../controllers/index.controller.js";

const router = Router();

router.post("/register", authControllers.handleRegister);

router.route("/verify-email").post(authControllers.handleVerifyEmail);

router
  .route("/send-otp")
  .get(authControllers.handleSendOtp);

router.route("/login").post(authControllers.handleLogin);

router.route("/logout").get(authControllers.handleLogout);

router.route("/check-auth").get(authControllers.handleUserSession);

export const authRoutes = router;
