import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import { apiKeyAuth } from "../middleware/apiKeyAuth.js";

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

// TRANSFER
router.post(
  "/transfer",
  apiKeyAuth,
  requireTransferPermission,
  transfer
);

// DEPOSIT INIT
router.post(
  "/deposit",
  jwtAuth ,
  (req, res, next) => {
    req.requiredPerm = "deposit";
    next();
  },
  apiKeyAuth,
  initializeDeposit
);

// DEPOSIT STATUS
router.get(
  "/deposit/:reference/status",
  (req, res, next) => {
    req.requiredPerm = "read";
    next();
  },
  apiKeyAuth,
  checkDepositStatus
);

// BALANCE
router.get(
  "/balance",
  (req, res, next) => {
    req.requiredPerm = "read";
    next();
  },
  apiKeyAuth,
  getBalance
);

// TRANSACTIONS
router.get(
  "/transactions",
  (req, res, next) => {
    req.requiredPerm = "read";
    next();
  },
  apiKeyAuth,
  getTransaction
);

// PAYSTACK WEBHOOK
router.post(
  "/paystack/webhook",
  express.raw({ type: "application/json" }),
  handleWebHook
);

export default router;
