import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useNavigate } from "react-router-dom";
import "../styles/antrianForm.css";

export default function AntrianForm() {
  const [layanan, setLayanan] = useState([]);
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  const [keluhan, setKeluhan] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${BASE_URL}/layanan`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLayanan(res.data);
      } catch {
        setLayanan([]);
      }
    };
    fetchLayanan();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(res.data.id);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLayananSelect = (item) => {
    setSelectedLayanan(item);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLayanan) return alert("Pilih layanan terlebih dahulu!");
    if (!userId)
      return alert("Sesi anda telah berakhir, silakan login kembali");

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${BASE_URL}/antrian`,
        {
          layanan_id: selectedLayanan.id,
          user_id: userId,
          keluhan: keluhan,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Antrian berhasil dibuat!");
      navigate("/history");
    } catch (err) {
      console.error("Failed to create antrian:", err);
      alert("Gagal membuat antrian!");
    }
    setLoading(false);
  };

  return (
    <div className="antrian-form-container">
      {!selectedLayanan ? (
        <>
          <div className="section-header">
            <h2>Pilih Layanan</h2>
            <p>Silakan pilih layanan kesehatan yang Anda butuhkan</p>
          </div>
          <div className="layanan-list">
            {layanan.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#888",
                  gridColumn: "1 / -1",
                }}
              >
                Tidak ada layanan tersedia.
              </div>
            ) : (
              layanan.map((item) => (
                <div
                  key={item.id}
                  className="layanan-card"
                  onClick={() => handleLayananSelect(item)}
                >
                  <img
                    src={
                      item.gambar
                        ? `/uploads/${item.gambar}`
                        : "/images/layanan-placeholder.png"
                    }
                    alt={item.nama_layanan}
                  />
                  <div className="layanan-title">{item.nama_layanan}</div>
                  <div className="layanan-desc">{item.deskripsi}</div>
                  <div className="layanan-duration">
                    <span>⏱</span>
                    {item.durasi_layanan} menit
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <form className="antrian-form" onSubmit={handleSubmit}>
          <div className="selected-layanan-info">
            <strong>Layanan dipilih:</strong>
            <div style={{ margin: "8px 0" }}>
              <span style={{ fontWeight: 600 }}>
                {selectedLayanan.nama_layanan}
              </span>
              <span style={{ color: "#64748b", marginLeft: 8 }}>
                ({selectedLayanan.durasi_layanan} menit)
              </span>
            </div>
            <button
              type="button"
              className="btn-cancel"
              style={{ marginBottom: 12 }}
              onClick={() => setSelectedLayanan(null)}
            >
              Pilih layanan lain
            </button>
          </div>
          <textarea
            className="input-keluhan"
            placeholder="Tuliskan keluhan Anda..."
            value={keluhan}
            onChange={(e) => setKeluhan(e.target.value)}
            required
            rows={4}
            style={{
              width: "100%",
              marginBottom: 16,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #cbd5e1",
            }}
          />
          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
            style={{ width: "100%", padding: "0.8rem", fontWeight: 600 }}
          >
            {loading ? "Membuat Antrian..." : "Buat Antrian"}
          </button>
        </form>
      )}
    </div>
  );
}
