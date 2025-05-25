import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getUsers = async (req, res) => {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: { id: req.params.id },
    });
    if (!response) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const registerHandler = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ msg: "Username sudah digunakan" });
    }

    const encryptPassword = await bcrypt.hash(password, 5);
    await User.create({
      username,
      email,
      password: encryptPassword,
      role,
    });

    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan di server" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let updatedData = {
      username,
      email,
    };

    if (password) {
      const encryptPassword = await bcrypt.hash(password, 5);
      updatedData.password = encryptPassword;
    }

    const result = await User.update(updatedData, {
      where: {
        id: req.params.id,
      },
    });

    if (result[0] === 0) {
      return res.status(404).json({
        status: "failed",
        message: "User tidak ditemukan atau tidak ada data yang berubah",
        updatedData: updatedData,
        result,
      });
    }

    res.status(200).json({ msg: "User berhasil diperbarui" });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.log(error.message);
  }
};

const loginHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
      attributes: [
        "id",
        "username",
        "password",
        "email",
        "role",
        "refresh_token",
      ],
    });

    if (!user) {
      return res.status(400).json({
        status: "Failed",
        message: "Username atau password salah",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        status: "Failed",
        message: "Username atau password salah",
      });
    }

    const safeUserData = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = jwt.sign(
      safeUserData,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m",
      }
    );

    const refreshToken = jwt.sign(
      safeUserData,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await User.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    return res.status(200).json({
      status: "Success",
      message: "Login berhasil",
      safeUserData,
      accessToken,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await User.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user.refresh_token) return res.sendStatus(204);
  const userId = user.id;
  await User.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

const getMe = async (req, res) => {
  try {
    console.log("req.userId dari token:", req.userId); // Tambahkan ini
    const user = await User.findOne({
      where: { id: req.userId },
      attributes: ["id", "username", "email", "role"],
    });
    console.log("User ditemukan:", user); // Tambahkan ini
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const changePasswordHandler = async (req, res) => {
  const userId = req.userId; // GANTI INI, sebelumnya: req.user.id
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Password lama salah" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password berhasil diubah" });
  } catch (error) {
    console.error("Gagal mengubah password:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


export {
  getUsers,
  getUserById,
  registerHandler,
  updateUser,
  deleteUser,
  loginHandler,
  logout,
  getMe,
};
