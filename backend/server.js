import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import codeRoutes from "./routes/codeRoutes.js";

dotenv.config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());

/* ---------- ROUTES ---------- */
app.use("/api/code", codeRoutes);

/* ---------- DB ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
);
