// @ts-nocheck

import { Router } from "express";

import * as oauthControllers from "../controllers/index.controller.js";

const router = Router();

router.route("/redirect").get(oauthControllers.handleOAuthRedirect);

router.route("/callback").get(oauthControllers.handleOAuthCallback);

export const oauthRoutes = router;
