import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ExistPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const congregationNumber = location.state?.congregationNumber;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!congregationNumber) {
      navigate("/");
    }
  }, [congregationNumber, navigate]);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <>
      <title>Request Submitted</title>
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "linear-gradient(to right, #d2e0fb, #fef9f7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "1rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "960px",
            height: isMobile ? "auto" : "600px",
            background: "rgba(255, 255, 255, 0.65)",
            backdropFilter: "blur(14px)",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            overflow: isMobile ? "visible" : "hidden",
            flexDirection: isMobile ? "column" : "row",
            margin: "0 auto",
          }}
        >
          {/* Mobile Logo Top */}
          {isMobile && (
            <div
              style={{
                width: "100%",
                padding: "0.5rem",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#fff",
              }}
            >
              <img
                src="/logo1.png"
                alt="Logo"
                style={{
                  width: "120px",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}

          {/* Left Section */}
          <div
            style={{
              width: isMobile ? "100%" : "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#c2d5d4",
              padding: isMobile ? "1rem" : "2rem",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.8)",
                padding: isMobile ? "1.2rem" : "2rem",
                borderRadius: "16px",
                width: "100%",
                maxWidth: isMobile ? "90%" : "320px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src="/check.png"
                alt="Checkmark"
                style={{
                  width: "32px",
                  height: "32px",
                  margin: "0 auto 1rem",
                }}
              />
              <p
                style={{
                  fontSize: isMobile ? "12px" : "13px",
                  fontWeight: "bold",
                  color: "#111",
                  marginBottom: "0.75rem",
                }}
              >
                Thank you for requesting to join Congregation #
                {congregationNumber || "____"}
              </p>
              <p
                style={{
                  fontSize: isMobile ? "11px" : "12px",
                  color: "#444",
                  marginBottom: "1rem",
                  lineHeight: "1.4",
                }}
              >
                An email has been sent to the administrator to review your
                admission. To help speed up the process, you may personally
                contact the admin as a reminder to approve your access.
              </p>
              <a
                href="mailto:admin@example.com"
                style={{
                  fontSize: isMobile ? "10px" : "11px",
                  color: "#072fcf",
                  textDecoration: "underline",
                }}
              >
                Mail the Admin
              </a>
            </div>
          </div>

          {/* Right Section for Desktop */}
          {!isMobile && (
            <div style={{ width: "50%", display: "block" }}>
              <img
                src="/logo1.png"
                alt="Visual"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExistPage;
