import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import {
  transfer,
  getBalance,
  getTransaction,
} from "../controllers/wallet.controller.js";

import {
  initializeDeposit,
  checkDepositStatus,
  handleWebHook,
} from "../controllers/payment.controller.js";
const router = express.Router();
const requireTransferPermission = (req, res, next) => {
  req.requiredPerm = "transfer";
  next();
};

router.post("/transfer", jwtAuth, requireTransferPermission, transfer);

///////////////////

//////////////////
router.post(
  "/deposit",
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
router.get(
  "/balance",
  jwtAuth,

  getBalance
);
router.get(
  "/transactions",
  jwtAuth,

  getTransaction
);
router.post(
  "/paystack/webhook",
  express.raw({ type: "application/json" }),
  handleWebHook
);
export default router;
