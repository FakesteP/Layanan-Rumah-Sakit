import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/profilePage.css";
import { BASE_URL } from "../utils";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          // Kalau token gak ada langsung redirect login
          navigate("/login");
          return;
        }

        const res = await axios.get(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
        if (err.response && err.response.status === 401) {
          // Token expired / invalid → hapus token dan redirect login
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      }
    };

    fetchUser();
  }, [navigate]);

  const getInitial = (username) => {
    if (!username || typeof username !== "string") return "U";
    return username[0].toUpperCase();
  };

  if (loading) {
    return (
      <div className="profil-container">
        <p>Loading profil...</p>
      </div>
    );
  }

  return (
    <div className="profil-container">
      <div className="profil-card">
        <div className="profil-header">
          <div className="profil-avatar">{getInitial(user.username)}</div>
          <div className="profil-name">
            <h2>{user.username || "Pengguna"}</h2>
            <p className="profil-role">{user.role || "Tidak diketahui"}</p>
          </div>
        </div>

        <div className="profil-details">
          <div className="detail-row">
            <span className="detail-label">📧 Email:</span>
            <span className="detail-value">{user.email || "-"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">🆔 ID:</span>
            <span className="detail-value">{user.nim || user.id || "-"}</span>
          </div>
        </div>

        <div className="profil-actions">
          <button
            className="btn primary"
            onClick={() => navigate("/profil/change-password")}
          >
            🔐 Ubah Password
          </button>
          <button
            className="btn secondary"
            onClick={() => navigate("/profil/edit")}
          >
            ✏️ Edit Profil
          </button>
          <button className="btn outline" onClick={() => navigate(-1)}>
            ← Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
