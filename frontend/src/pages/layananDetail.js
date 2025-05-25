import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils";
import "../styles/LayananDetail.css"; // Buat file CSS ini untuk styling detail

const LayananDetail = () => {
  const { id } = useParams();
  const [layanan, setLayanan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchLayanan = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/layanan/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLayanan(res.data);
      } catch (error) {
        setLayanan(null);
      }
    };
    fetchLayanan();
  }, [id, navigate]);

  if (!layanan) return <div className="layanan-detail-loading">Loading...</div>;

  return (
    <div className="layanan-detail-container">
      <div className="layanan-detail-card">
        {layanan.gambar && (
          <img
            src={`${BASE_URL}/uploads/${layanan.gambar}`}
            alt={layanan.nama_layanan}
            className="layanan-detail-img"
          />
        )}
        <div className="layanan-detail-content">
          <h2>{layanan.nama_layanan}</h2>
          <p className="layanan-detail-desc">{layanan.deskripsi}</p>
          <p className="layanan-detail-durasi">
            <b>Durasi:</b> {layanan.durasi_layanan} menit
          </p>
          <button className="primary-btn" onClick={() => navigate(-1)}>
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default LayananDetail;