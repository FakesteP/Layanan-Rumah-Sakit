import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils"; // Pastikan path ke utils.js sesuai
import UserForm from "./UserForm";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false); // Untuk loading hapus

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddNew = () => {
    setEditId(null);
    setInitialFormData({}); // Set ke objek kosong untuk form baru
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setInitialFormData(user);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${BASE_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert(`Gagal menghapus pengguna: ${err.response?.data?.message || err.message}`);
    } finally {
        setActionLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditId(null);
    setInitialFormData(null);
    fetchUsers();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditId(null);
    setInitialFormData(null);
  };

  return (
    <div className="admin-table-card">
      {!showForm && (
         <button className="btn-primary" style={{ marginBottom: 16 }} onClick={handleAddNew}>
            + Tambah User
         </button>
      )}

      {showForm && (
        <UserForm
          editId={editId}
          initialData={initialFormData || {}}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                 <span className="loading-spinner"></span> Memuat data...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                <span className="empty-icon">👥</span> Tidak ada data pengguna.
              </td>
            </tr>
          ) : (
            users.map((user, idx) => (
              <tr key={user.id}>
                <td>{idx + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(user)} title="Edit" disabled={actionLoading}>
                    ✏️
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(user.id)} title="Hapus" disabled={actionLoading}>
                    {actionLoading && editId === user.id ? <span className="loading-spinner-small"></span> : '🗑️'}
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
