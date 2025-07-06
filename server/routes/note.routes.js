import { Router } from "express";

import * as noteControllers from "../controllers/index.controller.js";

const router = Router();

router.post("/add-note", noteControllers.handleAddNote);

router.route("/edit-note/:id").post(noteControllers.handleEditNote);

router.post("/delete-note/:id", noteControllers.handleDeleteNote);

export const urlRoutes = router;
