import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ExistPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const congregationNumber = location.state?.congregationNumber;

  const [adminEmail, setAdminEmail] = useState(""); // ✅ store fetched email

  useEffect(() => {
    if (!congregationNumber) {
      navigate("/");
    } else {
      // ✅ Fetch admin email from backend
      const fetchAdminEmail = async () => {
        try {
          const res = await fetch(`/api/congregation/${congregationNumber}/admin`);
          if (!res.ok) throw new Error("No user found");
          const data = await res.json();
          setAdminEmail(data.adminEmail);
        } catch (err) {
          console.error(err);
          setAdminEmail("support@example.com"); // fallback
        }
      };

      fetchAdminEmail();
    }
  }, [congregationNumber, navigate]);

  return (
    <>
      <title>Request Submitted</title>
      <div
        style={{
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
        }}
      >
        {/* Logo */}
        <img
          src="/logo1.png"
          alt="Logo"
          style={{
            width: "140px",
            height: "auto",
            marginBottom: "2rem",
            borderRadius: "12px",
          }}
        />

        {/* Message Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            padding: "2rem",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src="/check.png"
            alt="Checkmark"
            style={{ width: "40px", height: "40px", margin: "0 auto 1rem" }}
          />
          <p
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#111",
              marginBottom: "0.75rem",
              lineHeight: "1.4",
            }}
          >
            Thank you for requesting to join Congregation #
            {congregationNumber || "____"}
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#444",
              marginBottom: "1rem",
              lineHeight: "1.6",
            }}
          >
            An email has been sent to the administrator to review your admission.
            To help speed up the process, you may personally contact the admin as
            a reminder to approve your access.
          </p>

          {/* ✅ Dynamic mailto link */}
          {adminEmail && (
            <a
              href={`mailto:${adminEmail}`}
              style={{
                fontSize: "12px",
                color: "#072fcf",
                textDecoration: "underline",
              }}
            >
              Mail the Admin ({adminEmail})
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default ExistPage;
