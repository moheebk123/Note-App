import { Router } from "express";

import * as noteControllers from "../controllers/index.controller.js";

const router = Router();

router.post("/add", noteControllers.handleAddNote);

router.route("/edit/:id").post(noteControllers.handleEditNote);

router.post("/delete/:id", noteControllers.handleDeleteNote);

export const urlRoutes = router;
