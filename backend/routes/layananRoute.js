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
import { uploadImage } from "../utils/UploadImage.js"; // Assuming you have an upload function in your controller


const router = express.Router();
router.get("/", verifyToken, getLayanan);
router.get("/:id", verifyToken, getLayananById);
router.post("/", verifyToken, isAdmin, uploadImage.single("gambar"), createLayanan);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  uploadImage.single("gambar"),
  updateLayanan
);
router.delete("/:id", verifyToken, isAdmin, deleteLayanan);

export default router;
