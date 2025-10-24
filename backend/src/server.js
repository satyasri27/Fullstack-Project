import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fullstack-project-vy2a.onrender.com",
      "https://your-frontend-deployed-url.com"
    ],
    credentials: true,
  })
)
app.use(express.json());

// Serve frontend build (when built during deploy)
const frontendDist = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDist));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);

// SPA fallback — return index.html for non-API routes
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.join(frontendDist, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));