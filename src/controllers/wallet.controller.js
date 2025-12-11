import axios from "axios";
import crypto from "crypto";
import Transaction from "../models/Transaction.js";
import Idempotency from "../models/Idempotency.js";
import Wallet from "../models/Wallet.js";
import mongoose from "mongoose";
export const transfer = async (req, res) => {
  const { amount, wallet_number } = req.body;
  const generateRef = () => crypto.randomUUID();
  if (!wallet_number || !amount || amount < 100) {
    return res.status(400).json({
      status: "error",
      message: "Invalid request. Minimum transfer is ₦1.00",
    });
  }
  const senderUserId = req.user?.id || req.userId;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderWallet = await Wallet.findOne({ userId: senderUserId }).session(
      session
    );
    if (!senderWallet) {
      throw new Error("Sender wallet not found");
    }

    const receiverWallet = await Wallet.findOne({
      walletNumber: wallet_number,
    }).session(session);
    if (!receiverWallet) {
      throw new Error("Recipient wallet not found");
    }

    if (senderWallet._id.toString() === receiverWallet._id.toString()) {
      throw new Error("Cannot transfer to your own wallet");
    }

    if (senderWallet.balance < amount) {
      throw new Error("Insufficient balance");
    }

    await Wallet.updateOne(
      { _id: senderWallet._id },
      { $inc: { balance: -amount } },
      { session }
    );

    await Wallet.updateOne(
      { _id: receiverWallet._id },
      { $inc: { balance: +amount } },
      { session }
    );

    await Transaction.create(
      [
        {
          walletId: senderWallet._id,
          type: "transfer_sent",
          amount: -amount,
          counterparty: receiverWallet._id,

          status: "completed",
          reference: generateRef(),
        },
        {
          walletId: receiverWallet._id,
          type: "transfer_received",
          amount: +amount,
          counterparty: senderWallet._id,

          status: "completed",
          reference: generateRef(),
        },
      ],
      { session, ordered: true }
    );

    await session.commitTransaction();

    return res.json({
      status: "success",
      message: "Transfer completed",
      data: {
        amount,
        recipient_wallet_number: wallet_number,
        new_balance: senderWallet.balance - amount,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(400).json({
      status: "error",
      message: error.message || "Transfer failed",
    });
  } finally {
    session.endSession();
  }
};
export const getBalance = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    const wallet = await Wallet.findOne({ userId }).select("balance");

    if (!wallet) {
      return res.status(404).json({
        status: "error",
        message: "Wallet not found",
      });
    }

    res.json({
      balance: wallet.balance,
    });
  } catch (error) {
    console.error("Get balance error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch balance",
    });
  }
};
export const getTransaction = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({
        status: "error",
        message: "Wallet not found",
      });
    }

    const transactions = await Transaction.find({ walletId: wallet._id })
      .sort({ createdAt: -1 })
      .select("type amount status counterparty createdAt");

    const formatted = transactions.map((tx) => ({
      type:
        tx.type === "transfer_sent"
          ? "transfer"
          : tx.type === "transfer_received"
          ? "transfer"
          : tx.type,
      amount: Math.abs(tx.amount),
      status: tx.status === "completed" ? "success" : tx.status,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch transactions",
    });
  }
};
