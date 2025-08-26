import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://loginpage-1.vercel.app/api";

const ExistPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const congregationNumber = location.state?.congregationNumber;

  const [adminEmail, setAdminEmail] = useState("admin@example.com");

  useEffect(() => {
    if (!congregationNumber) {
      navigate("/");
      return;
    }

    // Fetch existing user email for the congregation number
    const fetchAdminEmail = async () => {
      try {
        const res = await axios.get(`${API_URL}/getUserByCongregation?congId=${congregationNumber}`);
        if (res.data.email) setAdminEmail(res.data.email);
      } catch {
        // fallback email stays
      }
    };

    fetchAdminEmail();
  }, [congregationNumber, navigate]);

  return (
    <>
      <title>Request Submitted</title>
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "linear-gradient(to right, #d2e0fb, #fef9f7)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem 1rem",
          boxSizing: "border-box",
        }}
      >
        {/* Logo */}
        <img
          src="/logo1.png"
          alt="Logo"
          style={{ width: "140px", height: "auto", marginBottom: "2rem", borderRadius: "12px" }}
        />

        {/* Message Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            padding: "2rem",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src="/check.png"
            alt="Checkmark"
            style={{ width: "40px", height: "40px", margin: "0 auto 1rem" }}
          />
          <p style={{ fontSize: "14px", fontWeight: "bold", color: "#111", marginBottom: "0.75rem", lineHeight: "1.4" }}>
            Congregation #{congregationNumber || "____"} already exists
          </p>
          <p style={{ fontSize: "13px", color: "#444", marginBottom: "1rem", lineHeight: "1.6" }}>
            Please contact the administrator to approve your admission:
          </p>
          <a
            href={`mailto:${adminEmail}`}
            style={{ fontSize: "12px", color: "#072fcf", textDecoration: "underline" }}
          >
            Mail the Admin
          </a>
        </div>
      </div>
    </>
  );
};

export default ExistPage;
