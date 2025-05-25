import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils"; // Pastikan path sesuai dengan struktur project kamu

export default function UserForm({ editId, initialData, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (editId && initialData) {
      setForm({
        username: initialData.username || "",
        email: initialData.email || "",
        password: "", // Password tidak diisi saat edit untuk keamanan
        role: initialData.role || "user",
      });
    } else {
      setForm({
        username: "",
        email: "",
        password: "",
        role: "user",
      });
    }
  }, [editId, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.username || !form.email) {
      setError("Username dan Email wajib diisi.");
      setLoading(false);
      return;
    }
    if (!editId && !form.password) {
      setError("Password wajib diisi untuk pengguna baru.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("accessToken");
    const payload = { ...form };
    if (editId && !payload.password) {
      delete payload.password;
    }

    try {
      if (editId) {
        await axios.put(`${BASE_URL}/users/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${BASE_URL}/users`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess();
    } catch (err) {
      const message = err.response?.data?.message || "Gagal menyimpan data pengguna.";
      setError(message);
      console.error("Failed to save user:", err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="form-card"> {/* Pastikan class ini ada di CSS */}
      <h3 className="form-title">{editId ? "Edit User" : "Tambah User Baru"}</h3>
      <form onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            Password {editId && "(Kosongkan jika tidak ingin diubah)"}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            {...(!editId && { required: true })}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={form.role} onChange={handleChange} disabled={loading}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
