import React, { useEffect, useState } from "react";
import axios from "axios";
import LayananForm from "./LayananForm"; // Pastikan path ini benar
import { BASE_URL } from "../utils"; // Pastikan path ini benar
import "../styles/adminPage.css"; // Pastikan Anda memiliki CSS untuk styling tabel

export default function LayananTable() {
  const [layanan, setLayanan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [initialFormData, setInitialFormData] = useState(null);

  const fetchLayanan = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${BASE_URL}/layanan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLayanan(res.data);
    } catch (err) {
      console.error("Failed to fetch layanan:", err);
      // Berikan feedback error yang lebih baik jika perlu
      setLayanan([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLayanan();
  }, []);

  const handleEdit = (item) => {
    setEditId(item.id);
    // Pastikan initialData dikirim dengan benar, termasuk field gambar jika perlu
    // Untuk file gambar, biasanya tidak di-set kembali di form edit kecuali ada preview
    setInitialFormData({
        nama_layanan: item.nama_layanan || "",
        deskripsi: item.deskripsi || "",
        durasi_layanan: item.durasi_layanan || "",
        // gambar: item.gambar // Anda mungkin tidak ingin mengisi ulang input file
                               // tapi mungkin ingin menampilkan gambar yang sudah ada
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    // Ganti window.confirm dengan modal custom jika memungkinkan untuk UI yang lebih baik
    if (!window.confirm("Yakin hapus layanan ini?")) return;
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`${BASE_URL}/layanan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLayanan(); // Refresh data
    } catch (err) {
      console.error("Failed to delete layanan:", err);
      alert(`Gagal menghapus data: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditId(null);
    setInitialFormData(null); // Reset initial form data
    fetchLayanan(); // Refresh data
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditId(null);
    setInitialFormData(null); // Reset initial form data
  };

  return (
    <div className="admin-table-card">
      {!showForm && (
        <button
          className="btn-primary" // Pastikan class ini ada di CSS Anda
          style={{ marginBottom: 16 }}
          onClick={() => {
            setEditId(null);
            setInitialFormData({}); // Set ke objek kosong untuk form baru
            setShowForm(true);
          }}
        >
          + Input Layanan
        </button>
      )}

      {showForm && (
        <LayananForm
          editId={editId}
          initialData={initialFormData || {}} // Kirim objek kosong jika null
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Deskripsi</th>
            <th>Durasi (menit)</th>
            <th>Gambar</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                <span className="loading-spinner"></span> Memuat data...
              </td>
            </tr>
          ) : layanan.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                <span className="empty-icon">🏥</span> Tidak ada layanan.
              </td>
            </tr>
          ) : (
            layanan.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.nama_layanan}</td>
                <td>{item.deskripsi}</td>
                <td>{item.durasi_layanan || "-"}</td>
                <td>
                  {item.gambar ? (
                    <img
                      src={`../uploads/${item.gambar}`}
                      alt={item.nama_layanan}
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                      // Tambahkan penanganan error jika gambar gagal dimuat
                      onError={(e) => {
                        e.target.onerror = null; // Mencegah loop error
                        e.target.src = "https://placehold.co/48x48/E0E0E0/BDBDBD?text=N/A"; // Placeholder
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(item)} title="Edit">
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(item.id)}
                    title="Hapus"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
