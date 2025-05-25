// components/ChangePassword.js
import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `${BASE_URL}/users/changepw`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Password berhasil diubah");
      navigate("/profil");
    } catch (err) {
      console.error("Gagal mengubah password:", err);
      alert("Gagal mengubah password.");
    }
  };

  return (
    <div className="profile-container">
      <form className="profile-card" onSubmit={handleChangePassword}>
        <h2>Ubah Password</h2>
        <label>Password Lama:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <label>Password Baru:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <div className="profile-actions">
          <button className="btn primary" type="submit">
            🔐 Simpan Password
          </button>
          <button
            className="btn outline"
            onClick={() => navigate(-1)}
            type="button"
          >
            ← Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
