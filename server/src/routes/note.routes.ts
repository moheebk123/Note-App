// @ts-nocheck

import { Router } from "express";

import * as noteControllers from "../controllers/index.controller.js";

const router = Router();

router.get("/load", noteControllers.handleUserNotes);

router.post("/add", noteControllers.handleAddNote);

router.post("/edit/:id", noteControllers.handleEditNote);

router.delete("/delete/:id", noteControllers.handleDeleteNote);

export const noteRoutes = router;
