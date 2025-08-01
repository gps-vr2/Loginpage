import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://loginpage-1.vercel.app/api";

const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [resendText, setResendText] = useState("Send code");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [codeSentOnce, setCodeSentOnce] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/forgot");
    }
  }, [email, navigate]);

  const sendCode = async () => {
    if (!email) return;
    try {
      await axios.post(`${API_URL}/code`, { email });
      setResendText("Code sent!");
      setCodeSentOnce(true);
      setTimeout(() => setResendText("Resend code?"), 3000);
    } catch (err) {
      console.error("Failed to send code:", err);
      setResendText("Failed! Try again");
      setTimeout(() => setResendText("Resend code?"), 3000);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/[^0-9]/g, "");
    if (input.value.length === 1 && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredCode = inputRefs.current.map((ref) => ref?.value || "").join("");
    if (enteredCode.length !== 5) {
      setErrorMsg("Please enter the full 5-digit code.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/verify-code`, { email, code: enteredCode });
      const { resetToken } = res.data;

      if (resetToken) {
        navigate("/reset-password", { state: { email, resetToken } });
      } else {
        throw new Error("Verification successful, but no reset token was provided.");
      }
    } catch (err) {
      setErrorMsg("Invalid or expired code. Please try again.");
    }
  };

  return (
    <>
      <title>Verify Code</title>
      <div style={styles.container}>
        <div style={styles.card}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            style={styles.form}
          >
            <h2 style={styles.title}>🔐 Verification Code</h2>
            <p style={styles.subtitle}>
              A 5-digit code has been sent to <br />
              <span style={{ fontWeight: "bold", color: "#111" }}>{email}</span>
            </p>

            <div style={styles.codeContainer}>
              {[...Array(5)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  ref={(el) => (inputRefs.current[i] = el)}
                  onInput={(e) => handleInput(e, i)}
                  style={styles.codeInput}
                />
              ))}
            </div>

            {errorMsg && <p style={styles.error}>{errorMsg}</p>}

            <button type="submit" style={styles.button}>
              Verify and Proceed
            </button>

            <p style={styles.resend}>
              Didn't receive a code?{" "}
              <span onClick={sendCode} style={styles.resendLink}>
                {resendText}
              </span>
            </p>
          </form>
        </div>

        <div style={styles.imageSection}>
          <img
            src="/logo1.png"
            alt="Verification Visual"
            style={styles.image}
          />
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f5f7fb",
    overflow: "hidden",
  },
  card: {
    flex: 1,
    backgroundColor: "#c2d5d4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  form: {
    width: "100%",
    maxWidth: "360px",
    backgroundColor: "#fcfdff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "12px",
    color: "#111",
  },
  subtitle: {
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "20px",
    color: "#444",
    lineHeight: "1.5",
  },
  codeContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  codeInput: {
    width: "45px",
    height: "48px",
    textAlign: "center",
    border: "1px solid #d1d1d1",
    borderRadius: "8px",
    fontSize: "18px",
    backgroundColor: "#f6f6f6",
    color: "#000",
  },
  error: {
    textAlign: "center",
    color: "#e74c3c",
    fontSize: "13px",
    marginBottom: "16px",
  },
  button: {
    width: "100%",
    backgroundColor: "#7370e4",
    color: "#fff",
    padding: "10px",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  resend: {
    fontSize: "13px",
    textAlign: "center",
    marginTop: "15px",
    color: "#555",
  },
  resendLink: {
    color: "#7573d2",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: 500,
  },
  imageSection: {
    display: "none",
    flex: 1,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  "@media (min-width: 768px)": {
    imageSection: {
      display: "block",
    },
  },
};

export default VerificationPage;
