import ApiKey from "../models/ApiKey.js";
export const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(401).json({ message: "API key is missing" });
  }
  const key = await ApiKey.findOne({ key: apiKey });
  if (!key || key.revoked)
    return res.status(401).json({ error: "Invalid or revoked key" });
  if (key.expiry && new Date() > key.expiry)
    return res.status(401).json({ error: "Expired key" });
  const requiredPerm = req.requiredPerm;
  if (requiredPerm && !key.permissions.includes(requiredPerm)) {
    return res.status(403).json({ error: "Missing persmission" });
  }
  req.userId = key.userId;
  next();
};
