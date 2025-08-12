import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_URL = "https://loginpage-1.vercel.app/api";

const styles = {
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
    width: "100%",
    maxWidth: "960px",
    backgroundColor: "white",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    borderRadius: "0.5rem",
    overflow: "hidden",
    flexDirection: "row",
  },
  formContainer: {
    width: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    boxSizing: "border-box",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "360px",
  },
  title: {
    fontSize: "1.75rem",
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
    padding: "0.625rem 0.75rem",
    fontSize: "0.875rem",
    color: "#1f2937",
    marginBottom: "1rem",
    boxSizing: "border-box", // ✅ prevents cutting on mobile
  },
  disabledInput: {
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: "0.375rem",
    padding: "0.625rem 0.75rem",
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "1rem",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    backgroundColor: "#7370e4",
    color: "white",
    fontWeight: 500,
    padding: "0.625rem",
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
    width: "50%",
    display: "block",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  // ✅ Mobile adjustments
  mobileCard: {
    flexDirection: "column",
    height: "auto",
  },
  mobileFormContainer: {
    width: "100%",
    padding: "1.5rem",
  },
  hideOnMobile: {
    display: "none",
  },
} as const;

const NoCongregationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, login } = useAuth();

  const { name, whatsapp, congregationNumber } = location.state || {};

  const [congName, setCongName] = useState("");
  const [language, setLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toProperCase = (text: string) =>
    text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  useEffect(() => {
    if (!name || !whatsapp || !congregationNumber) {
      console.error("Missing user data. Redirecting to complete profile.");
      navigate("/complete-profile");
    }
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [name, whatsapp, congregationNumber, navigate]);

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
      <div style={styles.container}>
        <div
          style={{
            ...styles.card,
            ...(isMobile ? styles.mobileCard : {}),
          }}
        >
          <div
            style={{
              ...styles.formContainer,
              ...(isMobile ? styles.mobileFormContainer : {}),
            }}
          >
            <form onSubmit={handleSubmit} style={styles.formWrapper}>
              <h2 style={styles.title}>Congregation Not Found</h2>
              <p style={styles.subtitle}>
                Please provide details for the new congregation.
              </p>

              <label style={styles.label}>Congregation Number</label>
              <input
                type="text"
                value={congregationNumber}
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
          {!isMobile && (
            <div style={styles.imageContainer}>
              <img
                src="/logo1.png"
                alt="Congregation Illustration"
                style={styles.image}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NoCongregationPage;
