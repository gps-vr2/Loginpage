import { useState } from "react";
import type { CSSProperties } from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://loginpage-1.vercel.app/api";

// Define styles as objects to match the login page UI
const styles: { [key: string]: CSSProperties } = {
  container: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#E8ECEF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
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
    margin: '1rem',
  },
  formContainer: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '340px',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1.5rem',
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
    padding: '0.625rem 0.75rem',
    fontSize: '0.875rem',
    color: '#1f2937',
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#8B5CF6', // Purple color to match login
    color: 'white',
    fontWeight: 500,
    padding: '0.625rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '1rem',
  },
  imageContainer: {
    width: '50%',
    display: 'block',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

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
        <div style={styles.card}>
          <div style={styles.formContainer}>
            <div style={styles.formWrapper}>
              <h1 style={styles.title}>Register</h1>
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="email" style={styles.label}>Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter a valid email"
                    style={styles.input}
                    required
                  />
                </div>
                {errorMsg && <p style={{ fontSize: '0.75rem', color: '#ef4444', textAlign: 'center' }}>{errorMsg}</p>}
                <button type="submit" style={styles.registerButton}>Register</button>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#4b5563', paddingTop: '0.5rem' }}>
                  Already have an account?{" "}
                  <Link to="/loginform" style={{ color: '#8B5CF6' }}>Login</Link>
                </p>
              </form>
            </div>
          </div>
          <div style={styles.imageContainer}>
            <img src="/logo1.png" alt="Global Connectivity" style={styles.image} />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
