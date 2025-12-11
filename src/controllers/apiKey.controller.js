import crypto from "crypto";
import ApiKey from "../models/ApiKey.js";
import { getExpiryDate } from "../utils/expiryUtils.js";

export const createApiKey = async (req, res) => {
  try {
    const userId = req.user.id || req.userId;
    const { permissions = [], expiry } = req.body;
    const activeKeysCount = await ApiKey.countDocuments({
      userId,
      revoked: false,
    });
    if (activeKeysCount >= 5) {
      return res
        .status(400)
        .json({ message: "Maximum of 5 active API keys allowed." });
    }
    const key = `sk_${crypto.randomBytes(32).toString("hex")}`;
    const expiryDate = expiry ? getExpiryDate(expiry) : null;
    const apiKey = await ApiKey.create({
      userId,
      key,
      permissions,
      expiry: expiryDate,
      revoked: false,
    });
    res.status(201).json({
      message: "API key created successfully",
      apiKey: apiKey.key,
      expiresAt: apiKey.expiry,
      permissions: apiKey.permissions,
    });
  } catch (error) {
    console.error("Create API key error:", error);
    res.status(500).json({ error: "Failed to create API key" });
  }
};
export const rolloverApiKey = async (req, res) => {
  try {
    const userId = req.user.id || req.userId;
    const { oldKeyId, permissions = [], expiry } = req.body;
    const oldKey = await ApiKey.findOneAndUpdate(
      { key: oldKeyId, userId },
      { revoked: true },
      { new: true }
    );

    if (!oldKey) {
      return res.status(404).json({ error: "Old key not found" });
    }
    const newKeyValue = `sk_${crypto.randomBytes(32).toString("hex")}`;
    const expiryDate = expiry ? getExpiryDate(expiry) : null;
    const newKey = await ApiKey.create({
      userId,
      key: newKeyValue,
      permissions,
      expiry: expiryDate,
      revoked: false,
    });
    res.json({
      message: "key rolled over successfully",
      oldKeyId: oldKeyId,
      newApiKey: newKey.key,
      expiresAt: newKey.expiry,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to rollover API key" });
  }
};
