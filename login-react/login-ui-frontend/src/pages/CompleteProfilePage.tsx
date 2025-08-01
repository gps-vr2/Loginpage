import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  } as const,
  card: {
    display: "flex",
    width: "100%",
    maxWidth: "960px",
    height: "600px",
    backgroundColor: "white",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    borderRadius: "0.5rem",
    overflow: "hidden",
    margin: "1rem",
  } as const,
  formContainer: {
    width: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  } as const,
  formWrapper: {
    width: "100%",
    maxWidth: "340px",
  } as const,
  title: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "1.5rem",
    textAlign: "center",
  } as const,
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "0.25rem",
  } as const,
  input: {
    width: "100%",
    backgroundColor: "#f9fafb",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.625rem 0.75rem",
    fontSize: "0.875rem",
    color: "#1f2937",
    marginBottom: "1rem",
  } as const,
  errorText: {
    fontSize: "0.75rem",
    color: "#ef4444",
    marginTop: "-0.5rem",
    marginBottom: "0.5rem",
    textAlign: "center",
  } as const,
  submitButton: {
    width: "100%",
    backgroundColor: "#8B5CF6",
    color: "white",
    fontWeight: 500,
    padding: "0.625rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    marginTop: "0.5rem",
    transition: "background-color 0.3s",
  } as const,
  imageContainer: {
    width: "50%",
    display: "block",
  } as const,
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  } as const,
};

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [whatsapp, setWhatsapp] = useState("");
  const [congNum, setCongNum] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `${API_URL}/saveuser`,
        { name, whatsapp, congregationNumber: congNum },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { congregationExists } = res.data;

      if (congregationExists) {
        navigate("/exist", { state: { congregationNumber: congNum } });
      } else {
        navigate("/nocong", {
          state: {
            name,
            whatsapp,
            congregationNumber: congNum,
            email: user?.email,
          },
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <title>Complete Profile</title>
      <div style={styles.container}>
        <div style={styles.card}>
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
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Enter WhatsApp number"
                style={styles.input}
                required
              />

              <label style={styles.label}>Congregation Number</label>
              <input
                type="text"
                value={congNum}
                onChange={(e) => setCongNum(e.target.value)}
                placeholder="Enter Congregation Number"
                style={styles.input}
                required
              />

              {error && <p style={styles.errorText}>{error}</p>}

              <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Continue"}
              </button>
            </form>
          </div>
          <div style={styles.imageContainer}>
            <img src="/logo1.png" alt="Background Illustration" style={styles.image} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CompleteProfilePage;
