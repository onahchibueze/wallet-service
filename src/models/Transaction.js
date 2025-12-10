import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
  },
  type: {
    type: String,
    enum: ["deposit", "transfer_sent", "transfer_received"],
    required: true,
  },
  amount: { type: Number, required: true },
  reference: { type: String, unique: true }, // For Paystack idempotency
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  counterparty: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" }, // For transfers
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model("Transaction", transactionSchema);
