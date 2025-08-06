import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import * as Sentry from "@sentry/node";
import "./instrument.js";

import { createRequire } from "module"; // Import createRequire to use require in ESM which is needed for dotenvx

// Initialize database connection
const require = createRequire(import.meta.url);

dotenv.config();

const app = express();

require("@dotenvx/dotenvx").config();

//app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/users", userRoutes);

Sentry.setupExpressErrorHandler(app);

app.use(function onError(err, req, res, next) {
  // Log the error with Sentry
  Sentry.captureException(err);

  // temporarily log the error to the console for debugging
    console.error("Error occurred:", err);

  // Send a generic error message to the client
  res.status(500).json({ message: `An internal server error occurred. ID: ${res.sentry}` });
});



export default app;
