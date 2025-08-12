import { useState, useEffect, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useAuth } from "../contexts/AuthContext";

const API_URL = "https://loginpage-1.vercel.app/api";

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email as string | undefined;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!email) {
      console.error("No email provided. Redirecting to register.");
      navigate("/registerng");
    }
  }, [email, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/setpassword`, { email, password });
      const { token } = res.data;

      if (!token) throw new Error("Login token not received from server.");

      login(token);
      navigate("/complete-profile");
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const message = err.response?.data?.error || "Something went wrong.";
      setErrorMsg(message);
    }
  };

  return (
    <>
      <title>Set Password</title>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #d2e0fb, #fef9f7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            maxWidth: "960px",
            height: "600px",
            background: "rgba(255, 255, 255, 0.65)",
            backdropFilter: "blur(14px)",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          {/* Right Section - Hidden on Mobile */}
          <div
            style={{
              width: "50%",
              display: window.innerWidth < 768 ? "none" : "block",
            }}
          >
            <img
              src="/logo1.png"
              alt="Visual"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Left Section */}
          <div
            style={{
              width: window.innerWidth < 768 ? "100%" : "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: window.innerWidth < 768 ? "1rem" : "2rem",
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                width: "100%",
                maxWidth: "340px",
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                padding: "2rem",
                boxSizing: "border-box",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.6rem",
                  marginBottom: "1.5rem",
                  color: "#111827",
                }}
              >
                Set Password
              </h2>

              {/* Password */}
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password"
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  fontSize: "0.875rem",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#f9fafb",
                  marginBottom: "1rem",
                  boxSizing: "border-box",
                }}
                required
              />

              {/* Confirm Password */}
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  fontSize: "0.875rem",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#f9fafb",
                  marginBottom: "1rem",
                  boxSizing: "border-box",
                }}
                required
              />

              {/* Error Message */}
              {errorMsg && (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "0.75rem",
                    marginBottom: "1rem",
                    textAlign: "center",
                  }}
                >
                  {errorMsg}
                </p>
              )}

              {/* Button */}
              <button
                type="submit"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                  width: "100%",
                  backgroundColor: hover ? "#111827" : "#6366f1",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Register Account
              </button>

              {/* Back */}
              <p
                onClick={() => navigate(-1)}
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                  fontSize: "14px",
                  color: "#111",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Back
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetPasswordPage;
