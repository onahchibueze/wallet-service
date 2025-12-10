import express from "express";

const router = express.Router();
/*
import {
  initializeDeposit,
  checkDepositStatus,
  handleWebHook,
} from "../controllers/payment.controller.js";
import { jwtAuth } from "../middleware/jwtAuth.js";
router.post(
  "/deposit/initialize",
  jwtAuth,
  (req, res, next) => {
    req.requiredPerm = "deposit";
    next();
  },
  initializeDeposit
);
router.get(
  "/deposit/status/:reference",
  jwtAuth,
  (req, res, next) => {
    req.requiredPerm = "deposit";
    next();
  },
  checkDepositStatus
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebHook
);
export default router;
*/
