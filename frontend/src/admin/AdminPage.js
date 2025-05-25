import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/adminPage.css";
import LayananTable from "./LayananTable";
import UserTable from "./UserTable";
import { BASE_URL } from "../utils";

const statusList = ["menunggu", "dipanggil", "selesai", "batal"];
const statusColors = {
  menunggu: "#f59e0b",
  dipanggil: "#2563eb",
  selesai: "#10b981",
  batal: "#ef4444",
};

const sidebarMenus = [
  { key: "antrian", label: "Manajemen Antrian", icon: "📋" },
  { key: "layanan", label: "Manajemen Layanan", icon: "🏥" },
  { key: "users", label: "Manajemen User", icon: "👤" },
];

export default function AdminPage() {
  const [antrian, setAntrian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeMenu, setActiveMenu] = useState("antrian");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAntrian = async () => {
      if (activeMenu === "antrian") {
        setLoading(true);
        try {
          const token = localStorage.getItem("accessToken");
          const res = await axios.get(`${BASE_URL}/antrian`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const transformedData = res.data.map((item) => ({
            id: item.id,
            nama: item.user?.username || "Unknown", // Capitalized User for Sequelize model
            layanan: item.layanan?.nama_layanan || "Unknown", // Capitalized Layanan for Sequelize model
            keluhan: item.keluhan,
            status: item.status,
            tanggal_dibuat: item.tanggal_dibuat,
          }));

          setAntrian(transformedData);
        } catch (err) {
          console.error("Failed to fetch antrian:", err);
          setAntrian([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAntrian();
  }, [activeMenu]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `${BASE_URL}/antrian/${id}`, // Tambahkan BASE_URL
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Refresh data setelah update berhasil
      console.log(`Status antrian ${id} diubah menjadi ${newStatus}`);
      const res = await axios.get(`${BASE_URL}/antrian`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const transformedData = res.data.map((item) => ({
        id: item.id,
        nama: item.user?.username || "Unknown",
        layanan: item.layanan?.nama_layanan || "Unknown",
        keluhan: item.keluhan,
        status: item.status,
        tanggal_dibuat: item.tanggal_dibuat,
      }));

      setAntrian(transformedData);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(
        `Gagal mengubah status: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    // Jika ada data lain yang perlu dihapus, hapus di sini
    navigate("/login");
  };

  return (
    <div className="admin-dashboard-layout">
      <aside className={`admin-sidebar${sidebarOpen ? "" : " collapsed"}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">🛠️</span>
          {sidebarOpen && <span className="sidebar-title">Admin</span>}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          >
            {sidebarOpen ? "⏴" : "⏵"}
          </button>
        </div>
        <nav className="sidebar-menu">
          {sidebarMenus.map((menu) => (
            <button
              key={menu.key}
              className={`sidebar-menu-item${
                activeMenu === menu.key ? " active" : ""
              }`}
              onClick={() => setActiveMenu(menu.key)}
              title={menu.label}
            >
              <span className="sidebar-menu-icon">{menu.icon}</span>
              {sidebarOpen && <span>{menu.label}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-logout">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <span className="sidebar-logout-icon">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-header">
          <span className="admin-logo-text">
            {sidebarMenus.find((m) => m.key === activeMenu)?.label || ""}
          </span>
        </header>

        <main className="admin-main">
          {activeMenu === "antrian" && (
            <section className="admin-section">
              <div className="section-header">
                <span className="section-tag">Antrian</span>
                <h2 className="section-title">Manajemen Antrian Pasien</h2>
                <p className="section-subtitle">
                  Kelola status antrian pasien secara real-time dengan mudah dan
                  cepat.
                </p>
              </div>
              <div className="admin-table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>No. Antrian</th>
                      <th>Nama Pasien</th>
                      <th>Layanan</th>
                      <th>Keluhan</th>
                      <th>Waktu Daftar</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center" }}>
                          <span className="loading-spinner"></span> Memuat
                          data...
                        </td>
                      </tr>
                    ) : antrian.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center" }}>
                          <span className="empty-icon">📋</span>
                          Tidak ada antrian.
                        </td>
                      </tr>
                    ) : (
                      antrian.map((item) => (
                        <tr key={item.id} className="admin-table-row">
                          <td>{item.id}</td>
                          <td>{item.nama}</td>
                          <td>{item.layanan}</td>
                          <td>{item.keluhan}</td>
                          <td>
                            {new Date(item.tanggal_dibuat).toLocaleString(
                              "id-ID"
                            )}
                          </td>
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                background: statusColors[item.status],
                                color: "#fff",
                              }}
                            >
                              {item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <select
                              value={item.status}
                              disabled={updatingId === item.id}
                              onChange={(e) =>
                                handleStatusChange(item.id, e.target.value)
                              }
                              className="status-select"
                            >
                              {statusList.map((status) => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {activeMenu === "layanan" && (
            <section className="admin-section">
              <div className="section-header">
                <span className="section-tag">Layanan</span>
                <h2 className="section-title">Manajemen Layanan</h2>
                <p className="section-subtitle">
                  Tambah, edit, atau hapus layanan rumah sakit di sini.
                </p>
              </div>
              <LayananTable />
            </section>
          )}
          {activeMenu === "users" && (
            <section className="admin-section">
              <div className="section-header">
                <span className="section-tag">User</span>
                <h2 className="section-title">Manajemen User</h2>
                <p className="section-subtitle">
                  (Contoh) Fitur ini bisa kamu tambahkan sendiri.
                </p>
              </div>
              <UserTable/>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
