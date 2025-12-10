// src/models/Idempotency.js
import mongoose from "mongoose";

const idempotencySchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  processed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("Idempotency", idempotencySchema);
