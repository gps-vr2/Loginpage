import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "https://loginpage-1.vercel.app/api";

const InviteStatusPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, congregationNumber } = location.state || {};

  const [status, setStatus] = useState("checking");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!email || !congregationNumber) {
      navigate("/");
      return;
    }

    const checkInviteStatus = () => {
      // For now, just show the waiting message
      // In a real app, you might poll the backend for status updates
      setStatus("pending");
    };

    checkInviteStatus();
  }, [email, congregationNumber, navigate]);

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(to right, #d2e0fb, #fef9f7)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      fontFamily: "system-ui, sans-serif",
      padding: "2rem 1rem",
      boxSizing: "border-box",
    },
    logo: {
      width: "140px",
      height: "auto",
      marginBottom: "2rem",
      borderRadius: "12px",
    },
    card: {
      background: "rgba(255,255,255,0.85)",
      padding: "2rem",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    },
    icon: {
      width: "60px",
      height: "60px",
      margin: "0 auto 1rem",
      background: status === "pending" ? "#ff9800" : "#4CAF50",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      color: "white",
    },
    title: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#111",
      marginBottom: "1rem",
      lineHeight: 1.4,
    },
    text: {
      fontSize: "14px",
      color: "#444",
      marginBottom: "1.5rem",
      lineHeight: 1.6,
    },
    refreshBtn: {
      background: "#072fcf",
      color: "white",
      padding: "0.75rem 1.5rem",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      margin: "0.5rem",
    },
    homeBtn: {
      background: "transparent",
      color: "#072fcf",
      padding: "0.75rem 1.5rem",
      borderRadius: "8px",
      border: "2px solid #072fcf",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      margin: "0.5rem",
    },
    errorText: {
      fontSize: "14px",
      color: "#f00",
    },
  };

  return (
    <>
      <title>Invite Status</title>
      <div style={styles.container}>
        <img src="/logo1.png" alt="Logo" style={styles.logo} />

        <div style={styles.card}>
          <div style={styles.icon}>
            {status === "pending" ? "⏳" : status === "approved" ? "✓" : "❌"}
          </div>

          {status === "checking" ? (
            <p style={styles.text}>Checking your invite status...</p>
          ) : status === "pending" ? (
            <>
              <p style={styles.title}>
                Invite Pending Approval
              </p>
              <p style={styles.text}>
                Your request to join Congregation #{congregationNumber} is waiting for admin approval.
                <br/><br/>
                You will receive an email notification once your invite is approved.
                <br/><br/>
                Please be patient as the admin reviews your request.
              </p>
              <button
                style={styles.refreshBtn}
                onClick={() => window.location.reload()}
              >
                Check Again
              </button>
              <button
                style={styles.homeBtn}
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>
            </>
          ) : status === "approved" ? (
            <>
              <p style={styles.title}>
                Invite Approved!
              </p>
              <p style={styles.text}>
                Congratulations! Your invite has been approved.
                <br/>
                You can now log in with your credentials.
              </p>
              <button
                style={styles.refreshBtn}
                onClick={() => navigate("/loginform")}
              >
                Go to Login
              </button>
            </>
          ) : (
            <>
              <p style={styles.title}>
                Invite Status Unknown
              </p>
              <p style={styles.errorText}>
                Unable to check your invite status at this time.
              </p>
              <button
                style={styles.homeBtn}
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default InviteStatusPage;