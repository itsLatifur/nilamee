import express from "express";
import { getSiteStats } from "./public.controller.js";

const router = express.Router();

// Public stats endpoint
router.get("/stats", getSiteStats);

export default router;
