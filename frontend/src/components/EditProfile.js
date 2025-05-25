// components/EditProfile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useNavigate } from "react-router-dom";
import "../styles/editProfile.css";


const EditProfile = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Gagal memuat data profil:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `${BASE_URL}/users`,
        {
          username: user.username,
          email: user.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profil berhasil diperbarui");
      navigate("/profil");
    } catch (err) {
      console.error("Gagal menyimpan perubahan:", err);
      alert("Gagal menyimpan perubahan.");
    }
  };

  return (
    <div className="profile-container">
      <form className="profile-card" onSubmit={handleSave}>
        <h2>Edit Profil</h2>
        <label>Nama Pengguna:</label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
        <div className="profile-actions">
          <button className="btn primary" type="submit">
            💾 Simpan
          </button>
          <button className="btn outline" onClick={() => navigate(-1)} type="button">
            ← Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
