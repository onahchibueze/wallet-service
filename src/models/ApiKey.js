import mongoose from "mongoose";
const apiKeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  key: { type: String, required: true, unique: true },
  name: { type: String },
  permissions: [{ type: String }], // e.g., ['deposit', 'transfer', 'read']
  expiry: { type: Date },
  revoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model("ApiKey", apiKeySchema);
