import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  registerHandler,
  loginHandler,
  logout,
  getMe,
  changePasswordHandler,
} from "../controller/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Semua route pakai "/"
router.get("/me", verifyToken, getMe);
router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/logout", verifyToken, logout);
router.put("/changepw", verifyToken, changePasswordHandler);

export default router;
