import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/historyPage.css";
import { BASE_URL } from "../utils";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const username = "Hafizh"; // Ganti sesuai localStorage kalau perlu
  const userRole = "user"; // atau 'admin'

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${BASE_URL}/antrian/riwayat`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(response.data);
      } catch (error) {
        console.error("Gagal mengambil riwayat:", error);
        alert("Gagal mengambil data riwayat.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleProfile = () => {
    setDropdownOpen(false);
    navigate("/profil");
  };

  const handleHistory = () => {
    setDropdownOpen(false);
    navigate("/history");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="history-header">
        <div className="header-content">
          <div className="logo">
            <span role="img" aria-label="logo" className="logo-icon">🩺</span>
            <span className="logo-text">MedCare</span>
          </div>

          <nav className="main-nav">
            <a href="/dashboard" className="nav-link">Home</a>
            <a href="#services-section" className="nav-link">Services</a>
            <a href="#doctors-section" className="nav-link">Doctors</a>
            <a href="#emergency-section" className="nav-link">Contact</a>
          </nav>

          <div className="profile-dropdown" ref={dropdownRef}>
            <div
              className="profile-trigger"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              <div className="profile-avatar-wrapper">
                <span className="profile-avatar">{username[0]}</span>
              </div>
              <span className="profile-name">{username}</span>
              <span className="profile-caret">&#9662;</span>
            </div>

            {dropdownOpen && (
              <div className="profile-menu">
                <button className="menu-item" onClick={handleProfile}>
                  👤 <span className="menu-text">Profile</span>
                </button>
                <button className="menu-item" onClick={handleHistory}>
                  📜 <span className="menu-text">History</span>
                </button>
                {userRole === "admin" && (
                  <button
                    className="menu-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/admin");
                    }}
                  >
                    🛠️ <span className="menu-text">Admin</span>
                  </button>
                )}
                <button className="menu-item logout-btn" onClick={handleLogout}>
                  🚪 <span className="menu-text">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
     <main className="history-page" style={{ padding: "20px", maxWidth: "800px", margin: "20px auto" }}>
  <h2 style={{ marginBottom: "20px", textAlign: "center", color: "#2c3e50" }}>Riwayat Layanan Saya</h2>
  {loading ? (
    <p style={{ textAlign: "center" }}>Loading...</p>
  ) : history.length === 0 ? (
    <p style={{ textAlign: "center", color: "#7f8c8d" }}>Tidak ada riwayat layanan ditemukan.</p>
  ) : (
    <ul className="history-list" style={{ listStyle: "none", padding: 0 }}>
      {history.map((item, index) => (
        <li
          key={index}
          className="history-item"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            padding: "15px 20px",
            borderRadius: "8px",
            marginBottom: "15px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="history-left">
            <h4 style={{ margin: "0 0 8px 0", color: "#34495e" }}>{item.layanan?.nama_layanan}</h4>
            <p style={{ margin: 0, color: "#7f8c8d", fontSize: "0.9rem" }}>
              Tanggal: {new Date(item.tanggal_dibuat).toLocaleDateString()}
            </p>
          </div>
          <div className="history-right">
            <span
              className={`status-badge ${item.status.toLowerCase().replace(/\s/g, "-")}`}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                fontWeight: "600",
                fontSize: "0.9rem",
                color: "#fff",
                backgroundColor:
                  item.status.toLowerCase() === "selesai"
                    ? "#27ae60"
                    : item.status.toLowerCase() === "pending"
                    ? "#f39c12"
                    : item.status.toLowerCase() === "batal"
                    ? "#c0392b"
                    : "#34495e",
              }}
            >
              {item.status}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )}
</main>


      {/* FOOTER */}
      <footer className="history-footer">
        <p>&copy; {new Date().getFullYear()} MedCare. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HistoryPage;
