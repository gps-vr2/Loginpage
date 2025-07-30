import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://loginpage-1.vercel.app/api";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, resetToken } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!resetToken || !email) {
      navigate("/forgot");
    }
  }, [resetToken, email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await axios.post(`${API_URL}/reset-password`, {
        email,
        resetToken,
        newPassword: password,
      });

      setSuccess("✅ Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to reset password. The link may have expired."
      );
    }
  };

  return (
    <>
      <title>Reset Password</title>
      <div style={styles.wrapper}>
        <div style={styles.formWrapper}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.title}>🔒 Set a New Password</h2>

            <label style={styles.label}>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a new password"
              style={styles.input}
              required
            />

            <label style={styles.label}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              style={styles.input}
              required
            />

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}

            <button
              type="submit"
              disabled={!!success}
              style={{
                ...styles.button,
                backgroundColor: success ? "#ccc" : "#7370e4",
                cursor: success ? "not-allowed" : "pointer",
              }}
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f3f6fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "20px",
    color: "#222",
  },
  label: {
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "6px",
    color: "#333",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #d1d1d1",
    marginBottom: "16px",
    backgroundColor: "#f6f6f6",
    color: "#000",
  },
  error: {
    color: "#e74c3c",
    fontSize: "13px",
    marginBottom: "12px",
  },
  success: {
    color: "#2ecc71",
    fontSize: "13px",
    marginBottom: "12px",
  },
  button: {
    padding: "10px",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "6px",
    color: "#fff",
    transition: "0.2s",
    border: "none",
  },
};

export default ResetPasswordPage;
