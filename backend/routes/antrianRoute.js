import express from "express";
import {
  getAntrian,
  createAntrian,
  updateAntrian,
  deleteAntrian,
  getAntrianById,
} from "../controller/antrianController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();
router.get("/", verifyToken, getAntrian);
router.get("/:id", verifyToken, getAntrianById);
router.post("/", verifyToken, createAntrian);
router.put("/:id", verifyToken, isAdmin, updateAntrian);
router.delete("/:id", verifyToken, isAdmin, deleteAntrian);

export default router;
