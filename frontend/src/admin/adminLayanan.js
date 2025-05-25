import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/adminLayanan.css";
import { BASE_URL } from "../utils";

const AdminLayanan = () => {
  const [form, setForm] = useState({
    nama_layanan: "",
    deskripsi: "",
    durasi_layanan: "",
  });
  const [gambar, setGambar] = useState(null);
  const [layanan, setLayanan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // Ambil data layanan saat mount
  useEffect(() => {
    fetchLayanan();
  }, []);

  // Ambil data layanan
  const fetchLayanan = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${BASE_URL}/layanan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLayanan(res.data);
    } catch {
      setLayanan([]);
    }
    setLoading(false);
  };

  // Handle input text/number/textarea
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle input file
  const handleFileChange = (e) => {
    setGambar(e.target.files[0]);
  };

  // Submit tambah/update layanan
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("nama_layanan", form.nama_layanan);
    formData.append("deskripsi", form.deskripsi);
    formData.append("durasi_layanan", form.durasi_layanan);
    if (gambar) formData.append("gambar", gambar);

    try {
      if (editId) {
        await axios.put(`${BASE_URL}/layanan/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(`${BASE_URL}/layanan`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setForm({ nama_layanan: "", deskripsi: "", durasi_layanan: "" });
      setGambar(null);
      setEditId(null);
      fetchLayanan();
    } catch {
      alert("Gagal menyimpan data!");
    }
  };

  // Edit layanan
  const handleEdit = (item) => {
    setForm({
      nama_layanan: item.nama || item.nama_layanan,
      deskripsi: item.deskripsi,
      durasi_layanan: item.durasi_layanan || "",
    });
    setEditId(item.id);
    setGambar(null);
  };

  // Hapus layanan
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus layanan ini?")) return;
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`${BASE_URL}/layanan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLayanan();
    } catch {
      alert("Gagal menghapus data!");
    }
  };

  // Batal edit
  const handleCancel = () => {
    setForm({ nama_layanan: "", deskripsi: "", durasi_layanan: "" });
    setGambar(null);
    setEditId(null);
  };

  return (
    <div className="admin-layanan-form-container">
      <h2>Tambah / Edit Layanan</h2>
      <form
        className="admin-layanan-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="nama_layanan"
          placeholder="Nama Layanan"
          value={form.nama_layanan}
          onChange={handleChange}
          required
        />
        <textarea
          name="deskripsi"
          placeholder="Deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="durasi_layanan"
          placeholder="Durasi (menit)"
          value={form.durasi_layanan}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="gambar"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit" className="primary-btn">
          {editId ? "Update" : "Simpan"}
        </button>
        {editId && (
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Batal
          </button>
        )}
      </form>

      <h3 style={{ marginTop: "2rem" }}>Daftar Layanan</h3>
      <div className="admin-layanan-table-wrapper">
        <table className="admin-layanan-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Deskripsi</th>
              <th>Durasi</th>
              <th>Gambar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  Memuat data...
                </td>
              </tr>
            ) : layanan.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  Tidak ada layanan.
                </td>
              </tr>
            ) : (
              layanan.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.nama || item.nama_layanan}</td>
                  <td>{item.deskripsi}</td>
                  <td>{item.durasi_layanan || "-"}</td>
                  <td>
                    {item.gambar ? (
                      <img
                        src={
                          item.gambar.startsWith("http")
                            ? item.gambar
                            : `/uploads/${item.gambar}`
                        }
                        alt={item.nama || item.nama_layanan}
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(item)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
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
    </div>
  );
};

export default AdminLayanan;