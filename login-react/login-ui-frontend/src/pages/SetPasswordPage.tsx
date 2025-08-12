import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const API_URL = "https://loginpage-1.vercel.app/api";

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!email) {
      console.error("No email provided. Redirecting to register.");
      navigate("/registerng");
    }
  }, [email, navigate]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/setpassword`, { email, password });
      const { token } = res.data;
      if (!token) throw new Error("Login token not received from server.");
      login(token);
      navigate("/complete-profile");
    } catch (err: any) {
      const message = err.response?.data?.error || "Something went wrong.";
      setErrorMsg(message);
    }
  };

  return (
    <>
      <title>Set Password</title>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #d2e0fb, #fef9f7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "1rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            width: "100%",
            maxWidth: isMobile ? "420px" : "960px",
            height: isMobile ? "auto" : "600px",
            background: "rgba(255, 255, 255, 0.65)",
            backdropFilter: "blur(14px)",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            margin: isMobile ? "0 auto" : undefined,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Right Section: Logo (hidden or above on mobile) */}
          {isMobile ? (
            <div
              style={{
                width: "100%",
                padding: "1rem",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#fff",
              }}
            >
              <img
                src="/logo1.png"
                alt="Visual"
                style={{
                  width: "120px",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            </div>
          ) : (
            <div style={{ width: "50%", display: "block" }}>
              <img
                src="/logo1.png"
                alt="Visual"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          {/* Left Section: Form */}
          <div
            style={{
              width: isMobile ? "100%" : "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? "1rem" : "2rem",
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                width: "100%",
                maxWidth: isMobile ? "90%" : "340px",
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                padding: isMobile ? "1.2rem" : "2rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: isMobile ? "1.4rem" : "1.6rem",
                  marginBottom: "1.5rem",
                  color: "#111827",
                }}
              >
                Set Password
              </h2>

              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password"
                style={{
                  width: "100%",
                  padding: isMobile ? "0.55rem 0.7rem" : "0.6rem",
                  fontSize: isMobile ? "0.9rem" : "0.875rem",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#f9fafb",
                  marginBottom: "1rem",
                }}
                required
              />

              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                style={{
                  width: "100%",
                  padding: isMobile ? "0.55rem 0.7rem" : "0.6rem",
                  fontSize: isMobile ? "0.9rem" : "0.875rem",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#f9fafb",
                  marginBottom: "1rem",
                }}
                required
              />

              {errorMsg && (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "0.75rem",
                    marginBottom: "1rem",
                    textAlign: "center",
                  }}
                >
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                  width: "100%",
                  backgroundColor: hover ? "#111827" : "#6366f1",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: isMobile ? "0.9rem" : "0.875rem",
                  padding: isMobile ? "0.65rem" : "0.75rem",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Register Account
              </button>

              <p
                onClick={() => navigate(-1)}
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                  fontSize: "14px",
                  color: "#111",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Back
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetPasswordPage;
