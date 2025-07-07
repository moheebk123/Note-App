import { Router } from "express";
import * as authControllers from "../controllers/index.controller.js";

const router = Router();

router
  .route("/register")
  .post(authControllers.handleRegister);

router
  .route("/verify-email")
  .post(authControllers.handleVerifyEmail);

router
  .route("/resend-verification-link")
  .get(authControllers.handleResendVerificationLink);

router
  .route("/login")
  .post(authControllers.handleLogin);

router
  .route("/reset-password")
  .post(authControllers.handleResetPassword);

router
  .route("/forget-password/:resetPasswordToken")
  .post(authControllers.handleForgetPassword);

router.route("/logout").get(authControllers.handleLogout);

export const authRoutes = router;
