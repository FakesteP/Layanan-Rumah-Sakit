import express from "express";
import { upload } from "../controller/layananController.js";

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
router.post("/", verifyToken, isAdmin, upload.single("gambar"), createLayanan);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("gambar"),
  updateLayanan
);
router.delete("/:id", verifyToken, isAdmin, deleteLayanan);

export default router;
