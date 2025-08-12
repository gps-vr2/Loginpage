import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://loginpage-1.vercel.app/api";

// Add mobile overrides for compact, centered layout
const styles: { [key: string]: CSSProperties } = {
  container: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#E8ECEF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  card: {
    display: 'flex',
    width: '100%',
    maxWidth: '960px',
    height: '600px',
    backgroundColor: 'white',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    margin: '1rem auto',
  },
  cardMobile: {
    flexDirection: 'column',
    maxWidth: '420px',
    width: '100%',
    height: 'auto',
    borderRadius: '1rem',
    overflow: 'visible',
    margin: '0 auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  formContainerMobile: {
    width: '100%',
    padding: '1rem',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '340px',
  },
  formWrapperMobile: {
    maxWidth: '90%',
    margin: "0 auto",
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '0.25rem',
  },
  input: {
    width: '100%',
    backgroundColor: '#f9fafb',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    padding: '0.6rem 0.75rem',
    fontSize: '0.875rem',
    color: '#1f2937',
    boxSizing: 'border-box',
  },
  inputMobile: {
    fontSize: '0.9rem',
    padding: '0.55rem 0.7rem',
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#8B5CF6',
    color: 'white',
    fontWeight: 500,
    padding: '0.6rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '1rem',
  },
  registerButtonMobile: {
    fontSize: '0.9rem',
    padding: '0.6rem',
  },
  imageContainer: {
    width: '50%',
    display: 'block',
  },
  imageContainerMobile: {
    width: '100%',
    padding: '0.5rem',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageMobile: {
    width: '120px',
    height: 'auto',
    borderRadius: '8px',
  },
};

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await axios.post(`${API_URL}/register`, { email });
      navigate("/setpass", { state: { email: email } });
    } catch (err: any) {
      const message = err.response?.data?.error || "Registration failed.";
      setErrorMsg(message);
    }
  };

  return (
    <>
      <title>Register</title>
      <div style={styles.container}>
        <div style={{ ...styles.card, ...(isMobile ? styles.cardMobile : {}) }}>
          {isMobile && (
            <div style={styles.imageContainerMobile}>
              <img src="/logo1.png" alt="Logo" style={styles.imageMobile} />
            </div>
          )}
          <div
            style={{
              ...styles.formContainer,
              ...(isMobile ? styles.formContainerMobile : {}),
            }}
          >
            <div
              style={{
                ...styles.formWrapper,
                ...(isMobile ? styles.formWrapperMobile : {}),
              }}
            >
              <h1 style={styles.title}>Register</h1>
              <form
                onSubmit={handleRegister}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                }}
              >
                <div>
                  <label htmlFor="email" style={styles.label}>Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter a valid email"
                    style={{
                      ...styles.input,
                      ...(isMobile ? styles.inputMobile : {}),
                    }}
                    required
                  />
                </div>
                {errorMsg && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#ef4444',
                    textAlign: 'center',
                  }}>
                    {errorMsg}
                  </p>
                )}
                <button
                  type="submit"
                  style={{
                    ...styles.registerButton,
                    ...(isMobile ? styles.registerButtonMobile : {}),
                  }}
                >
                  Register
                </button>
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#4b5563',
                    paddingTop: '0.5rem',
                  }}
                >
                  Already have an account?{" "}
                  <Link to="/loginform" style={{ color: '#8B5CF6' }}>Login</Link>
                </p>
              </form>
            </div>
          </div>
          {!isMobile && (
            <div style={styles.imageContainer}>
              <img src="/logo1.png" alt="Global Connectivity" style={styles.image} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
