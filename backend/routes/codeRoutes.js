import express from "express";
import {
  formatCode,
  getCode
} from "../controllers/codeController.js";

const router = express.Router();

router.post("/format", formatCode);
router.get("/:slug", getCode);

export default router;
