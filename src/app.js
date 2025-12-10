import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from "../src/models/User.js";
import authRoutes from "./routes/auth.routes.js";
import apiKeyRoutes from "./routes/apiKey.route.js";
import Wallet from "../src/models/Wallet.js";
// import paymentRoutes from "./routes/payment.route.js";
import walletRoutes from "./routes/wallet.routes.js";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import specs from "swagger-jsdoc(swaggerOptions)";
dotenv.config();
const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wallet Service API - Stage 8",
      version: "1.0.0",
      description: "API for wallet management with Paystack, JWT, and API Keys",
    },
    servers: [{ url: "/" }], // Update to your deployed URL later
    components: {
      securitySchemes: {
        bearerAuth: {
          // For JWT
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        apiKeyAuth: {
          // For x-api-key
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Scans JSDoc in route files
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.json());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        });
        await Wallet.create({ userId: user._id });
      }
      done(null, user);
    }
  )
);
app.use("/auth", authRoutes);
app.use("/keys", apiKeyRoutes);
// app.use("/payments", paymentRoutes);
app.use("/wallet", walletRoutes);
export default app;
