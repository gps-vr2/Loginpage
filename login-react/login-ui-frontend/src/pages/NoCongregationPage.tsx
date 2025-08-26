import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_URL = "https://loginpage-1.vercel.app/api";

const NoCongregationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, login } = useAuth();

  const { name, whatsapp, congregationNumber } = location.state || {};

  const [congName, setCongName] = useState("");
  const [language, setLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!name || !whatsapp || !congregationNumber) {
      navigate("/complete-profile");
    }
  }, [name, whatsapp, congregationNumber, navigate]);

  const toProperCase = (text: string) =>
    text.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_URL}/Congname`,
        {
          name,
          whatsapp,
          congregationNumber,
          congregationName: toProperCase(congName),
          language: toProperCase(language),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { token: sessionToken } = res.data;
      if (sessionToken) {
        login(sessionToken);
        alert("New congregation created and user registered successfully!");
        navigate("/App_page");
      } else {
        throw new Error("Did not receive session token from server.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save congregation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <title>Congregation Details</title>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ width: "100%", maxWidth: "450px", background: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
          <img src="/logo1.png" alt="Logo" style={{ width: "140px", margin: "0 auto 1rem" }} />
          <form onSubmit={handleSubmit}>
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Create New Congregation</h2>

            <label>Congregation Number</label>
            <input type="text" value={congregationNumber || ""} disabled style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.5rem", backgroundColor: "#e5e7eb" }} />

            <label>Name of Congregation*</label>
            <input type="text" value={congName} onChange={(e) => setCongName(e.target.value)} placeholder="Congregation Name" required style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.5rem" }} />

            <label>Language*</label>
            <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language" required style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", borderRadius: "0.5rem" }} />

            {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

            <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: "0.75rem", backgroundColor: "#7370e4", color: "white", borderRadius: "0.5rem", border: "none", cursor: "pointer" }}>
              {isSubmitting ? "Saving..." : "Save and Continue"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NoCongregationPage;
