import axios from "axios";
import crypto from "crypto";
import Transaction from "../models/Transaction.js";
import Idempotency from "../models/Idempotency.js";
import Wallet from "../models/Wallet.js";
import mongoose from "mongoose";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();
export const initializeDeposit = async (req, res) => {
  const { amount } = req.body;
const userId = req.userId;

  const wallet = await Wallet.findOne({ userId });
  const reference = crypto.randomUUID();
  await Transaction.create({
    walletId: wallet._id,
    type: "deposit",
    amount,
    status: "pending",
    reference,
  });

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.user.email,
        amount: amount * 100,
        reference,
      },
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );
    res.json({
      authorization_url: response.data.data.authorization_url,
      reference,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Initialization failed" });
  }
};
export const handleWebHook = async (req, res) => {
  try {
    const payload = JSON.stringify(req.body);
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(payload)
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      console.log("Computed hash:", hash);

      return res.status(400).json({ error: "Invalid signature" });
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const { reference, amount } = event.data;

      const idemp = await Idempotency.findOne({ reference });
      if (idemp && idemp.processed)
        return res.status(200).send("Already processed");

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const tx = await Transaction.findOne({ reference }).session(session);
        if (!tx || tx.status !== "pending")
          throw new Error("Invalid transaction");

        await Wallet.updateOne(
          { _id: tx.walletId },
          { $inc: { balance: amount / 100 } },
          { session }
        );

        await Transaction.updateOne(
          { _id: tx._id },
          { status: "completed" },
          { session }
        );

        await Idempotency.create([{ reference, processed: true }], { session });

        await session.commitTransaction();
      } catch (err) {
        await session.abortTransaction();
        return res.status(400).json({ error: err.message });
      } finally {
        session.endSession();
      }
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

export const checkDepositStatus = async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );
    const { status, amount } = response.data.data;
    res.json({ status, amount: amount / 100 }); // No wallet update!
  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
};
