import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// MODELS
import User from "../src/models/User.js";
import Wallet from "../src/models/Wallet.js";

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import apiKeyRoutes from "./routes/apiKey.route.js";
import walletRoutes from "./routes/wallet.routes.js";

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
//  SWAGGER CONFIG
// =========================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wallet Service API - Stage 8",
      version: "1.0.0",
      description: "API for wallet operations with Paystack, JWT, and API Keys",
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:3000",
        description: "Default server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        apiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// =========================
// GOOGLE AUTH
// =========================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0]?.value || "",
            name: profile.displayName,
          });

          // Create wallet for new user
          await Wallet.create({ userId: user._id, balance: 0 });
        }

        done(null, user);
      } catch (err) {
        console.error("Google Auth Error:", err);
        done(err, null);
      }
    }
  )
);

// =========================
// ROUTES
// =========================
app.use("/auth", authRoutes);
app.use("/keys", apiKeyRoutes);
app.use("/wallet", walletRoutes);

// Export app
export default app;
