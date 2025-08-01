import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ExistPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const congregationNumber = location.state?.congregationNumber;

  useEffect(() => {
    if (!congregationNumber) {
      navigate("/");
    }
  }, [congregationNumber, navigate]);

  return (
    <>
      <title>Request Submitted</title>
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
          {/* Left Section */}
          <div
            style={{
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#c2d5d4",
              padding: "2rem",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.8)",
                padding: "2rem",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "320px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src="/check.png"
                alt="Checkmark"
                style={{ width: "32px", height: "32px", margin: "0 auto 1rem" }}
              />
              <p
                style={{
                  fontSize: "13px",
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
                  fontSize: "12px",
                  color: "#444",
                  marginBottom: "1rem",
                  lineHeight: "1.4",
                }}
              >
                An email has been sent to the administrator to review your admission.
                To help speed up the process, you may personally contact the admin
                as a reminder to approve your access.
              </p>
              <a
                href="mailto:admin@example.com"
                style={{
                  fontSize: "11px",
                  color: "#072fcf",
                  textDecoration: "underline",
                }}
              >
                Mail the Admin
              </a>
            </div>
          </div>

          {/* Right Section */}
          <div style={{ width: "50%", display: "block" }}>
            <img
              src="/logo1.png"
              alt="Visual"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExistPage;
