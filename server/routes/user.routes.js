import { Router } from "express";

import * as userControllers from "../controllers/index.controller.js";

const router = Router();

router
  .route("/edit-profile")
  .post(userControllers.handleEditProfile);

router
  .route("/set-password")
  .post(userControllers.handleSetPassword);

router
  .route("/change-password")
  .post(userControllers.handleChangePassword);

router.route("/delete-account").delete(userControllers.handleDeleteAccount);

export const userRoutes = router;
