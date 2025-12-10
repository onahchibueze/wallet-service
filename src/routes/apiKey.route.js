import express from "express";

const router = express.Router();
import { createApiKey } from "../controllers/apiKey.controller.js";
import { rolloverApiKey } from "../controllers/apiKey.controller.js";
import { jwtAuth } from "../middleware/jwtAuth.js";
router.post("/create", jwtAuth, createApiKey);
router.post("/rollover", jwtAuth, rolloverApiKey);
export default router;
