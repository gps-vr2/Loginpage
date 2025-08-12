import type { CSSProperties } from "react";

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

  const isMobile = window.innerWidth <= 768;

  const styles: { [key: string]: CSSProperties } = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#E8ECEF",
      padding: "1rem",
      fontFamily: "system-ui, sans-serif",
    },
    card: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      width: "100%",
      maxWidth: "960px",
      background: "#fff",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      borderRadius: "8px",
      overflow: "hidden",
    },
    formContainer: {
      flex: 1,
      padding: "2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    formWrapper: { width: "100%", maxWidth: "340px" },
    title: { fontSize: "1.875rem", fontWeight: "bold", color: "#111827", marginBottom: "1.5rem", textAlign: "center" },
    label: { fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "0.25rem", display: "block" },
    input: {
      width: "100%",
      background: "#f9fafb",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "0.625rem 0.75rem",
      fontSize: "0.875rem",
      color: "#1f2937",
      marginBottom: "1rem",
    },
    errorText: { fontSize: "0.75rem", color: "#ef4444", marginTop: "-0.5rem", marginBottom: "0.5rem", textAlign: "center" },
    submitButton: {
      width: "100%",
      background: "#8B5CF6",
      color: "#fff",
      fontWeight: 500,
      padding: "0.625rem",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      marginTop: "0.5rem",
    },
    imageContainer: { flex: 1, display: isMobile ? "none" : "block" },
    image: { width: "100%", height: "100%", objectFit: "cover" },
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
          <div style={styles.formContainer}>
            <form onSubmit={handleSubmit} style={styles.formWrapper}>
              <h2 style={styles.title}>Complete Your Profile</h2>

              <label style={styles.label}>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" style={styles.input} required />

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
                onChange={(e) => setCongNum(e.target.value.replace(/\D/g, "").slice(0, 7))}
                onKeyDown={handleNumberInput}
                placeholder="Enter 6-digit Congregation Number"
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
          <div style={styles.imageContainer}>
            <img src="/logo1.png" alt="Background Illustration" style={styles.image} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CompleteProfilePage;
