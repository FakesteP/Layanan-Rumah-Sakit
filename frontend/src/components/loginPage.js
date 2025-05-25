import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useNavigate, Link } from "react-router-dom";  // tambahkan Link di sini
import "../styles/loginPage.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" atau "error"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, form, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", response.data.accessToken);
      setMessage("Login berhasil!");
      setMessageType("success");
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Gagal login.");
      setMessageType("error");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-logo">
          <span role="img" aria-label="logo">
            🩺
          </span>{" "}
          MedCare
        </div>
        <h2>Login to Your Account</h2>
        {message && (
          <p
            className={`login-message ${
              messageType === "success" ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <div className="login-footer">
          <span>Belum punya akun?</span>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
