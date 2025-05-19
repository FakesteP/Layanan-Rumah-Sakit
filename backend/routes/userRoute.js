import express from "express";
import {
  getUsers, 
  getUserById,
  updateUser,
  deleteUser,
  registerHandler,
  loginHandler,
  logout,
} from "../controller/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Semua route pakai "/"
router.get("/", getUsers); 
router.get("/:id", getUserById); 
router.put("/:id", updateUser); 
router.delete("/:id", deleteUser); 
router.post("/register", registerHandler); 
router.post("/login", loginHandler); 
router.post("/logout", verifyToken, logout); 

export default router;
