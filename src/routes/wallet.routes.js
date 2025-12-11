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

router.post("/transfer", apiKeyAuth, requireTransferPermission, transfer);

///////////////////

//////////////////
router.post(
  "/deposit",
  (req, res, next) => {
    req.requiredPerm = "deposit";
    next();
  },
  apiKeyAuth,
  initializeDeposit
);

router.get(
  "/deposit/:reference/status",

  (req, res, next) => {
    req.requiredPerm = "deposit";
    next();
  },
   apiKeyAuth,
  checkDepositStatus
);
router.get(
  "/balance",

 (req, res, next) => {
    req.requiredPerm = "read";
    next();
  },
   apiKeyAuth,
  getBalance
);
router.get(
  "/transactions",

 (req, res, next) => {
    req.requiredPerm = "read";
    next();
  },
  apiKeyAuth,
  getTransaction
);
router.post(
  "/paystack/webhook",
  express.raw({ type: "application/json" }),
  handleWebHook
);
export default router;
