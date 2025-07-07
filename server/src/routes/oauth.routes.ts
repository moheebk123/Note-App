import { Router } from "express";

import * as oauthControllers from "../controllers/index.controller.js";

const router = Router();

router.route("/oauth/google").get(oauthControllers.handleOAuthRedirect);

router
  .route("/oauth-redirect/google/callback")
  .get(oauthControllers.handleOAuthCallback);

export const oauthRoutes = router;
