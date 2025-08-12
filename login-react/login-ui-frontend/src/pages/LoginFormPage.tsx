import { useState, useRef, useEffect } from "react";
import type { CSSProperties } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const API_URL = "https://loginpage-1.vercel.app/api";

const styles: { [key: string]: CSSProperties } = {
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
    height: "600px",
    backgroundColor: "white",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    borderRadius: "0.5rem",
    overflow: "hidden",
    margin: "1rem auto",
  },
  // Mobile-specific overrides
  cardMobile: {
    flexDirection: "column",
    maxWidth: "420px",
    width: "100%",
    height: "auto",
    borderRadius: "1rem",
    overflow: "visible",
    margin: "0 auto",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  formContainerMobile: {
    width: "100%",
    padding: "1rem",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "340px",
  },
  formWrapperMobile: {
    maxWidth: "90%",
    margin: "0 auto",
  },
  title: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "1rem",
  },
  googleButton: {
    width: "100%",
    border: "none",
    color: "white",
    backgroundColor: "#42596d",
    fontSize: "0.875rem",
    fontWeight: 500,
    padding: "0.6rem",
    borderRadius: "0.375rem",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "1rem 0",
  },
  hr: {
    flexGrow: 1,
    borderTop: "1px solid #e5e7eb",
  },
  dividerText: {
    margin: "0 1rem",
    fontSize: "0.75rem",
    color: "#9ca3af",
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
    padding: "0.6rem 0.75rem",
    fontSize: "0.875rem",
    color: "#1f2937",
    boxSizing: "border-box",
  },
  inputMobile: {
    fontSize: "0.9rem",
    padding: "0.55rem 0.7rem",
  },
  passwordInputContainer: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#8B5CF6",
    color: "white",
    fontWeight: 500,
    padding: "0.6rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  loginButtonMobile: {
    fontSize: "0.9rem",
    padding: "0.6rem",
  },
  imageContainer: {
    width: "50%",
    display: "block",
  },
  imageContainerMobile: {
    width: "100%",
    padding: "0.5rem",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imageMobile: {
    width: "120px",
    height: "auto",
    borderRadius: "8px",
  },
};

const LoginFormPage = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token } = res.data;
      localStorage.setItem("authToken", token);
      navigate("/App_page");
    } catch (err: any) {
      const message = err.response?.data?.error || "Login failed.";
      setErrorMsg(message);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <>
      <title>Login</title>
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
              <h1 style={styles.title}>Login</h1>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                style={styles.googleButton}
              >
                <img
                  src="/google.png"
                  alt="Google"
                  style={{ width: "20px", height: "20px" }}
                />
                Sign in with Google
              </button>

              <div style={styles.divider}>
                <hr style={styles.hr} />
                <span style={styles.dividerText}>or</span>
                <hr style={styles.hr} />
              </div>

              <form
                onSubmit={handleLogin}
                style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
              >
                <div>
                  <label htmlFor="email" style={styles.label}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    ref={emailRef}
                    required
                    placeholder="Enter a registered email"
                    style={{
                      ...styles.input,
                      ...(isMobile ? styles.inputMobile : {}),
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="password" style={styles.label}>
                    Password
                  </label>
                  <div style={styles.passwordInputContainer}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      ref={passwordRef}
                      required
                      placeholder="Enter your password"
                      style={{
                        ...styles.input,
                        ...(isMobile ? styles.inputMobile : {}),
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.75rem",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#4b5563",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{ width: "0.875rem", height: "0.875rem" }}
                    />
                    Remember me
                  </label>
                  <Link to="/forgot" style={{ color: "#8B5CF6" }}>
                    Forgot password?
                  </Link>
                </div>

                {errorMsg && (
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#ef4444",
                      textAlign: "center",
                    }}
                  >
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  style={{
                    ...styles.loginButton,
                    ...(isMobile ? styles.loginButtonMobile : {}),
                  }}
                >
                  Login
                </button>

                <p
                  style={{
                    textAlign: "center",
                    fontSize: "0.75rem",
                    color: "#4b5563",
                    paddingTop: "0.5rem",
                  }}
                >
                  No account?{" "}
                  <Link to="/registerng" style={{ color: "#8B5CF6" }}>
                    Create one
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {!isMobile && (
            <div style={styles.imageContainer}>
              <img
                src="/logo1.png"
                alt="Global Connectivity"
                style={styles.image}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginFormPage;
