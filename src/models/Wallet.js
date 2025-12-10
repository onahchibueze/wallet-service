import mongoose from "mongoose";
const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  balance: { type: Number, default: 0.0 }, // In NGN
  walletNumber: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      // Auto generate 13-digit wallet number on creation
      return "4" + Math.floor(100000000000 + Math.random() * 900000000000);
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model("Wallet", walletSchema);
