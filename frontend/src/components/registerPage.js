import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BASE_URL } from "../utils";
import "../styles/loginPage.css";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Password strength logic
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 6) strength += 1;
    if (password.length > 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getStrengthColor = () => {
    if (passwordStrength < 2) return "#e74c3c";
    if (passwordStrength < 4) return "#f39c12";
    return "#2ecc71";
  };

  const getStrengthText = () => {
    if (passwordStrength < 2) return "Weak";
    if (passwordStrength < 4) return "Medium";
    return "Strong";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Password and Confirmation Password don't match!");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email format!");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters!");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`${BASE_URL}/users/register`, {
        username,
        email,
        password,
        role: "pasien",
      });

      setSuccessMessage("Registration successful! Redirecting to login...");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPasswordStrength(0);
      setIsLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "An error occurred during registration."
      );
    }
  };

  return (
    <motion.div
      className="login-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="login-container"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="login-logo">
    <span role="img" aria-label="logo">🩺</span> MedCare
  </div>
        <h2 style={{ marginBottom: "1.5rem" }}>Create Account</h2>

        {errorMessage && (
          <motion.div
            className="login-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: "#e74c3c",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              background: "rgba(231, 76, 60, 0.1)",
            }}
          >
            {errorMessage}
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            className="login-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: "#2ecc71",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              background: "rgba(46, 204, 113, 0.1)",
            }}
          >
            {successMessage}
          </motion.div>
        )}

        <form className="login-form" onSubmit={handleRegister}>
          <div className="form-group">
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Create a password"
              required
            />
            {password && (
              <div style={{ marginTop: "8px" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "4px",
                      background: "#e0e0e0",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        height: "100%",
                        background: getStrengthColor(),
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "12px", color: getStrengthColor() }}>
                    {getStrengthText()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <div
                style={{ color: "#e74c3c", fontSize: "12px", marginTop: "6px" }}
              >
                Passwords don't match
              </div>
            )}
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.7 : 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span> Creating Account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegisterForm;
