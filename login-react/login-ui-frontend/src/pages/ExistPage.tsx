import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "https://loginpage-1.vercel.app/api";

const ExistPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const congregationNumber = location.state?.congregationNumber;
  const userEmail = location.state?.userEmail;

  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!congregationNumber || !userEmail) {
      navigate("/");
      return;
    }

    const fetchAdminEmailAndNotify = async () => {
      try {
        const res = await fetch(
          `${API_URL}/getUserByCongregation?congId=${congregationNumber}`
        );
        const data = await res.json();

        if (res.ok && data.email) {
          setAdminEmail(data.email);

          // Send notification email to admin
          await fetch(`${API_URL}/notify-admin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              congregationNumber,
              userEmail,
              adminEmail: data.email,
            }),
          });

          // Optional redirect after 5 seconds
          setTimeout(() => {
            navigate("/login");
          }, 5000);
        } else {
          setErrorMsg("No admin found for this congregation.");
        }
      } catch {
        setErrorMsg("Failed to fetch admin email or send notification.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminEmailAndNotify();
  }, [congregationNumber, userEmail, navigate]);

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
    checkImage: {
      width: "40px",
      height: "40px",
      margin: "0 auto 1rem",
    },
    title: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#111",
      marginBottom: "0.75rem",
      lineHeight: 1.4,
    },
    text: {
      fontSize: "13px",
      color: "#444",
      marginBottom: "1rem",
      lineHeight: 1.6,
    },
    link: {
      fontSize: "12px",
      color: "#072fcf",
      textDecoration: "underline",
    },
    errorText: {
      fontSize: "14px",
      color: "#f00",
    },
  };

  return (
    <>
      <title>Request Submitted</title>
      <div style={styles.container}>
        <img src="/logo1.png" alt="Logo" style={styles.logo} />

        <div style={styles.card}>
          <img src="/check.png" alt="Checkmark" style={styles.checkImage} />

          {loading ? (
            <p style={styles.text}>Checking congregation info...</p>
          ) : errorMsg ? (
            <p style={styles.errorText}>{errorMsg}</p>
          ) : (
            <>
              <p style={styles.title}>
                Thank you for requesting to join Congregation #{congregationNumber}
              </p>
              <p style={styles.text}>
                An email has been sent to the administrator to review your admission.
                You can also personally contact the admin to speed up the approval.
              </p>
              <a href={`mailto:${adminEmail}`} style={styles.link}>
                Mail the Admin
              </a>
              <p style={{ marginTop: "1rem", fontSize: "12px", color: "#6b7280" }}>
                Redirecting shortly...
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ExistPage;