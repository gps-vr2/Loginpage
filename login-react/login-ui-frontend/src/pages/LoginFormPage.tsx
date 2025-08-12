import type { CSSProperties } from "react";

import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const API_URL = "https://loginpage-1.vercel.app/api";

const LoginFormPage = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

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
    googleButton: {
      width: "100%",
      background: "#42596d",
      color: "#fff",
      fontSize: "0.875rem",
      fontWeight: 500,
      padding: "0.625rem",
      borderRadius: "6px",
      marginBottom: "1.25rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      cursor: "pointer",
      border: "none",
    },
    divider: { display: "flex", alignItems: "center", margin: "1.25rem 0" },
    hr: { flex: 1, border: "none", borderTop: "1px solid #e5e7eb" },
    dividerText: { margin: "0 1rem", fontSize: "0.75rem", color: "#9ca3af" },
    label: { fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "0.25rem" },
    input: {
      width: "100%",
      background: "#f9fafb",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: "0.625rem 0.75rem",
      fontSize: "0.875rem",
      color: "#1f2937",
    },
    passwordContainer: { position: "relative" },
    eyeButton: {
      position: "absolute",
      right: "0.75rem",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#9ca3af",
    },
    loginButton: {
      width: "100%",
      background: "#8B5CF6",
      color: "#fff",
      fontWeight: 500,
      padding: "0.625rem",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
    },
    imageContainer: {
      flex: 1,
      display: isMobile ? "none" : "block",
    },
    image: { width: "100%", height: "100%", objectFit: "cover" },
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email: emailRef.current?.value || "",
        password: passwordRef.current?.value || "",
      });
      localStorage.setItem("authToken", res.data.token);
      navigate("/App_page");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    <>
      <title>Login</title>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.formContainer}>
            <div style={styles.formWrapper}>
              <h1 style={styles.title}>Login</h1>
              <button type="button" onClick={() => (window.location.href = `${API_URL}/auth/google`)} style={styles.googleButton}>
                <img src="/google.png" alt="Google" style={{ width: 20, height: 20 }} />
                Sign in with Google
              </button>
              <div style={styles.divider}>
                <hr style={styles.hr} />
                <span style={styles.dividerText}>or</span>
                <hr style={styles.hr} />
              </div>
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label htmlFor="email" style={styles.label}>Email</label>
                  <input type="email" id="email" ref={emailRef} required placeholder="Enter a registered email" style={styles.input} />
                </div>
                <div>
                  <label htmlFor="password" style={styles.label}>Password</label>
                  <div style={styles.passwordContainer}>
                    <input type={showPassword ? "text" : "password"} id="password" ref={passwordRef} required placeholder="Enter your password" style={styles.input} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4b5563", cursor: "pointer" }}>
                    <input type="checkbox" style={{ width: "0.875rem", height: "0.875rem" }} /> Remember me
                  </label>
                  <Link to="/forgot" style={{ color: "#8B5CF6" }}>Forgot password?</Link>
                </div>
                {errorMsg && <p style={{ fontSize: "0.75rem", color: "#ef4444", textAlign: "center" }}>{errorMsg}</p>}
                <button type="submit" style={styles.loginButton}>Login</button>
                <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#4b5563", paddingTop: "0.5rem" }}>
                  No account? <Link to="/registerng" style={{ color: "#8B5CF6" }}>Create one</Link>
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

export default LoginFormPage;
