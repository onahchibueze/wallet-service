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
apiKeyAuth,
  (req, res, next) => {
    req.requiredPerm = "deposit";
    next();
  },
  initializeDeposit
);
router.get(
  "/deposit/:reference/status",
 apiKeyAuth,
  (req, res, next) => {
    req.requiredPerm = "deposit";
    next();
  },
  checkDepositStatus
);
router.get(
  "/balance",
  apiKeyAuth,
apiKeyAuth,
 (req, res, next) => {
    req.requiredPerm = "read";
    next();
  },
  getBalance
);
router.get(
  "/transactions",
apiKeyAuth,
 (req, res, next) => {
    req.requiredPerm = "read";
    next();
  },
  getTransaction
);
router.post(
  "/paystack/webhook",
  express.raw({ type: "application/json" }),
  handleWebHook
);
export default router;
