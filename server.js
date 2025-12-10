import express from "express";
import { connectDB } from "./src/config/db.js";

import dotenv from "dotenv";

dotenv.config();
import app from "./src/app.js";

// Middleware

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", async () => {
  await connectDB();
  console.log(`✅ Server started at http://0.0.0.0:${PORT}`);
});
