import express from "express";
import {
  getLayanan,
  createLayanan,
  updateLayanan,
  deleteLayanan,
  getLayananById,
} from "../controller/layananController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();
router.get("/", verifyToken, getLayanan);
router.get("/:id", verifyToken, getLayananById);
router.post("/", verifyToken, isAdmin, createLayanan);
router.put("/:id", verifyToken, isAdmin, updateLayanan);
router.delete("/:id", verifyToken, isAdmin, deleteLayanan);

export default router;
