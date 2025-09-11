import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_URL = "https://loginpage-1.vercel.app/api";

const CongregationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, login } = useAuth();

  const { name, whatsapp, congregationNumber } = location.state || {};

  const [congName, setCongName] = useState("");
  const [language, setLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isExisting, setIsExisting] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const toProperCase = (text: string) =>
    text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Redirect if profile info missing
  useEffect(() => {
    if (!name || !whatsapp || !congregationNumber) {
      navigate("/complete-profile");
    }
  }, [name, whatsapp, congregationNumber, navigate]);

  // Mobile check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check if congregation exists
  useEffect(() => {
    const checkCongregation = async () => {
      if (!congregationNumber) return;
      try {
        const res = await axios.get(
          `${API_URL}/getUserByCongregation?congId=${congregationNumber}`
        );
        if (res.data.email) {
          setAdminEmail(res.data.email);
          setIsExisting(true);

          // Auto redirect after showing email
          setTimeout(() => {
            navigate("/login"); // or "/App_page" if you prefer
          }, 5000); // 5 seconds delay
        }
      } catch {
        setIsExisting(false);
      }
    };
    checkCongregation();
  }, [congregationNumber, navigate]);

  // Handle form submit for new congregation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_URL}/saveuser`,
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

  // --- Styles ---
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#E8ECEF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      padding: "1rem",
      boxSizing: "border-box",
    },
    card: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      width: "100%",
      maxWidth: isMobile ? "420px" : "960px",
      height: isMobile ? "auto" : "600px",
      backgroundColor: "white",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      borderRadius: isMobile ? "1rem" : "0.5rem",
      overflow: "hidden",
      margin: isMobile ? "0 auto" : "1rem",
      justifyContent: "center",
      alignItems: "center",
    },
    formContainer: {
      width: isMobile ? "100%" : "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "1rem" : "2rem",
    },
    formWrapper: {
      width: "100%",
      maxWidth: isMobile ? "90%" : "360px",
    },
    title: {
      fontSize: isMobile ? "1.5rem" : "1.75rem",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "0.5rem",
      textAlign: "center",
    },
    subtitle: {
      fontSize: "0.875rem",
      color: "#6b7280",
      textAlign: "center",
      marginBottom: "1.5rem",
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#374151",
      marginBottom: "0.25rem",
    },
    input: {
      width: "100%",
      backgroundColor: "#f9fafb",
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
      padding: isMobile ? "0.55rem 0.7rem" : "0.625rem 0.75rem",
      fontSize: isMobile ? "0.9rem" : "0.875rem",
      color: "#1f2937",
      marginBottom: "1rem",
      boxSizing: "border-box",
    },
    disabledInput: {
      width: "100%",
      backgroundColor: "#e5e7eb",
      borderRadius: "0.375rem",
      padding: isMobile ? "0.55rem 0.7rem" : "0.625rem 0.75rem",
      fontSize: isMobile ? "0.9rem" : "0.875rem",
      color: "#6b7280",
      marginBottom: "1rem",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      backgroundColor: "#7370e4",
      color: "white",
      fontWeight: 500,
      padding: isMobile ? "0.6rem" : "0.625rem",
      fontSize: isMobile ? "1rem" : undefined,
      borderRadius: "0.375rem",
      border: "none",
      cursor: "pointer",
      marginTop: "0.5rem",
      transition: "background-color 0.3s",
    },
    errorText: {
      fontSize: "0.75rem",
      color: "#ef4444",
      marginTop: "-0.5rem",
      marginBottom: "0.5rem",
      textAlign: "center",
    },
    imageContainer: {
      width: isMobile ? "100%" : "50%",
      display: isMobile ? "flex" : "block",
      justifyContent: "center",
      padding: isMobile ? "1rem" : undefined,
      backgroundColor: isMobile ? "#fff" : undefined,
      borderRadius: isMobile ? "1rem" : undefined,
      marginTop: isMobile ? "1rem" : undefined,
      boxShadow: isMobile
        ? "0 4px 12px rgba(0,0,0,0.1)"
        : undefined,
    },
    image: {
      width: isMobile ? "150px" : "100%",
      height: isMobile ? "auto" : "100%",
      objectFit: "cover",
      borderRadius: isMobile ? "8px" : undefined,
    },
  };

  if (isExisting) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ ...styles.formContainer, flexDirection: "column" }}>
            <h2 style={styles.title}>Congregation Already Exists</h2>
            <p style={styles.subtitle}>
              This congregation number is already registered. Please contact the admin:
            </p>
            <a
              href={`mailto:${adminEmail}`}
              style={{
                color: "#072fcf",
                textDecoration: "underline",
                textAlign: "center",
              }}
            >
              {adminEmail}
            </a>
            <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#6b7280" }}>
              Redirecting shortly...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.formWrapper}>
            <h2 style={styles.title}>Congregation Not Found</h2>
            <p style={styles.subtitle}>
              Please provide details for the new congregation.
            </p>

            <label style={styles.label}>Congregation Number</label>
            <input
              type="text"
              value={congregationNumber || ""}
              disabled
              style={styles.disabledInput}
            />

            <label style={styles.label}>Name of Congregation*</label>
            <input
              type="text"
              value={congName}
              onChange={(e) => setCongName(e.target.value)}
              placeholder="Name of Congregation"
              required
              style={styles.input}
            />

            <label style={styles.label}>Language*</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Language of Congregation"
              required
              style={styles.input}
            />

            {error && <p style={styles.errorText}>{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              style={styles.button}
            >
              {isSubmitting ? "Saving..." : "Save and Continue"}
            </button>
          </form>
        </div>
        <div style={styles.imageContainer}>
          <img
            src="/logo1.png"
            alt="Congregation Illustration"
            style={styles.image}
          />
        </div>
      </div>
    </div>
  );
};

export default CongregationPage;
