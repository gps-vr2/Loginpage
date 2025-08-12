import type { CSSProperties } from "react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_URL = "https://loginpage-1.vercel.app/api";

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [whatsapp, setWhatsapp] = useState("");
  const [congNum, setCongNum] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [congNumError, setCongNumError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const styles: { [key: string]: CSSProperties } = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#E8ECEF",
      padding: "1rem",
      fontFamily: "system-ui, sans-serif",
      boxSizing: "border-box",
    },
    card: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      width: "100%",
      maxWidth: isMobile ? "420px" : "960px",
      background: "#fff",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      borderRadius: isMobile ? "1rem" : "8px",
      overflow: "hidden",
      margin: isMobile ? "0 auto" : "1rem",
      justifyContent: "center",
      alignItems: "center",
      height: isMobile ? "auto" : "600px",
    },
    formContainer: {
      flex: 1,
      padding: isMobile ? "1.5rem" : "2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    formWrapper: {
      width: "100%",
      maxWidth: isMobile ? "90%" : "340px",
      background: isMobile ? "rgba(255,255,255,0.9)" : "transparent",
      borderRadius: isMobile ? "12px" : undefined,
      padding: isMobile ? "1rem" : undefined,
      boxShadow: isMobile ? "0 4px 12px rgba(0,0,0,0.1)" : undefined,
    },
    title: {
      fontSize: isMobile ? "1.5rem" : "1.875rem",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "1.5rem",
      textAlign: "center",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#374151",
      marginBottom: "0.25rem",
      display: "block",
    },
    input: {
      width: "100%",
      background: "#f9fafb",
      border: "1px solid #d1d5db",
      borderRadius: isMobile ? "8px" : "6px",
      padding: isMobile ? "0.55rem 0.7rem" : "0.625rem 0.75rem",
      fontSize: isMobile ? "0.9rem" : "0.875rem",
      color: "#1f2937",
      marginBottom: "1rem",
      boxSizing: "border-box",
    },
    errorText: {
      fontSize: "0.75rem",
      color: "#ef4444",
      marginTop: "-0.5rem",
      marginBottom: "0.5rem",
      textAlign: "center",
    },
    submitButton: {
      width: "100%",
      background: "#8B5CF6",
      color: "#fff",
      fontWeight: 500,
      padding: isMobile ? "0.65rem" : "0.625rem",
      fontSize: isMobile ? "0.95rem" : undefined,
      borderRadius: isMobile ? "10px" : "6px",
      border: "none",
      cursor: "pointer",
      marginTop: "0.5rem",
      transition: "background-color 0.3s ease",
    },
    imageContainer: {
      flex: 1,
      display: isMobile ? "none" : "block",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    imageMobileWrapper: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      padding: "1rem",
      backgroundColor: "#fff",
      borderRadius: "1rem",
      marginBottom: "1rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    imageMobile: {
      width: "120px",
      height: "auto",
      borderRadius: "8px",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setWhatsappError("");
    setCongNumError("");

    if (whatsapp.length < 8 || whatsapp.length > 15) {
      setWhatsappError("Enter a valid WhatsApp number.");
      return;
    }
    if (congNum.length !== 7) {
      setCongNumError("Congregation number must be exactly 7 digits.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${API_URL}/saveuser`,
        { name, whatsapp, congregationNumber: congNum },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.congregationExists) {
        navigate("/exist", { state: { congregationNumber: congNum } });
      } else {
        navigate("/nocong", {
          state: { name, whatsapp, congregationNumber: congNum, email: user?.email },
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
      e.preventDefault();
    }
  };

  return (
    <>
      <title>Complete Profile</title>
      <div style={styles.container}>
        <div style={styles.card}>
          {/* On mobile, show logo above the form */}
          {isMobile && (
            <div style={styles.imageMobileWrapper}>
              <img src="/logo1.png" alt="Logo" style={styles.imageMobile} />
            </div>
          )}

          <div style={styles.formContainer}>
            <form onSubmit={handleSubmit} style={styles.formWrapper}>
              <h2 style={styles.title}>Complete Your Profile</h2>

              <label style={styles.label}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                style={styles.input}
                required
              />

              <label style={styles.label}>WhatsApp Number</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                onKeyDown={handleNumberInput}
                placeholder="Enter WhatsApp number"
                style={styles.input}
                required
              />
              {whatsappError && <p style={styles.errorText}>{whatsappError}</p>}

              <label style={styles.label}>Congregation Number</label>
              <input
                type="text"
                value={congNum}
                maxLength={7}
                onChange={(e) =>
                  setCongNum(e.target.value.replace(/\D/g, "").slice(0, 7))
                }
                onKeyDown={handleNumberInput}
                placeholder="Enter 7-digit Congregation Number"
                style={styles.input}
                required
              />
              {congNumError && <p style={styles.errorText}>{congNumError}</p>}
              {error && <p style={styles.errorText}>{error}</p>}

              <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Continue"}
              </button>
            </form>
          </div>

          {/* Show desktop image only */}
          {!isMobile && (
            <div style={styles.imageContainer}>
              <img
                src="/logo1.png"
                alt="Background Illustration"
                style={styles.image}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompleteProfilePage;
