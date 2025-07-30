import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://loginpage-1.vercel.app/api";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(`${API_URL}/checkmail`, { email });
      navigate("/verification", { state: { email } });
    } catch (err: any) {
      const message =
        err.response?.data?.error || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Forgot Password</title>
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "linear-gradient(to right, #d2e0fb, #fef9f7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "960px",
            height: "600px",
            background: "rgba(255, 255, 255, 0.65)",
            backdropFilter: "blur(14px)",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          {/* Left Section */}
          <div
            style={{
              width: "50%",
              backgroundColor: "#c2d5d4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                width: "100%",
                maxWidth: "320px",
                backgroundColor: "#fcfdff",
                borderRadius: "0.5rem",
                padding: "1.5rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                  color: "#111",
                  marginBottom: "1.25rem",
                }}
              >
                Forgot Password
              </h2>

              <label
                htmlFor="email"
                style={{
                  fontSize: "0.875rem",
                  color: "#0b0b0b",
                  fontWeight: 500,
                  marginBottom: "0.25rem",
                  display: "block",
                }}
              >
                Email
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "12px",
                  borderRadius: "0.375rem",
                  outline: "1px solid #d1d1d1",
                  backgroundColor: "#f6f6f6",
                  color: "#000",
                  marginBottom: "0.75rem",
                }}
              />

              {error && (
                <p style={{ fontSize: "12px", color: "#dc2626", marginBottom: "0.75rem" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: loading ? "#a1a1a1" : "#7370e4",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "0.625rem",
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginBottom: "1rem",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {loading ? "Checking..." : "Send Verification Code"}
              </button>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#111",
                }}
              >
                Back to{" "}
                <Link to="/" style={{ color: "#7573d2", textDecoration: "underline" }}>
                  Login
                </Link>
              </p>
            </form>
          </div>

          {/* Right Section */}
          <div style={{ width: "50%", display: "block" }}>
            <img
              src="/logo1.png"
              alt="Forgot Password Visual"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
