import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/layananForm.css";
import { BASE_URL } from "../utils";

export default function LayananForm({ editId = null, initialData = {}, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    nama_layanan: "",
    deskripsi: "",
    durasi_layanan: "",
    gambar: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "gambar") {
      setForm({ ...form, gambar: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("nama_layanan", form.nama_layanan);
    formData.append("deskripsi", form.deskripsi);
    formData.append("durasi_layanan", form.durasi_layanan);
    if (form.gambar instanceof File) {
      formData.append("gambar", form.gambar);
    }

    try {
      if (editId) {
        // mode edit
        await axios.put(`${BASE_URL}/layanan/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // mode tambah
        await axios.post(`${BASE_URL}/layanan`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (onSuccess) onSuccess();
    } catch {
      alert("Gagal menyimpan data!");
    }
    setLoading(false);
  };

  return (
    <div className="layanan-form-modal">
      <form
        className="layanan-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h3>{editId ? "Edit Layanan" : "Input Layanan"}</h3>

        <input
          type="text"
          name="nama_layanan"
          placeholder="Nama Layanan"
          value={form.nama_layanan}
          onChange={handleChange}
          required
        />

        <input
          type="text"
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
          onChange={handleChange}
        />

        <div style={{ marginTop: 12 }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {editId ? "Simpan Perubahan" : "Simpan"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            style={{ marginLeft: 8 }}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
