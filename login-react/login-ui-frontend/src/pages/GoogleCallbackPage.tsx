import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const isNewUser = searchParams.get('isNewUser') === 'true';

    if (token) {
      login(token);
      if (isNewUser) {
        navigate('/complete-profile');
      } else {
        navigate('/App_page');
      }
    } else {
      alert('Google authentication failed. Please try again.');
      navigate('/');
    }
  }, [searchParams, login, navigate]);

  return (
    <>
      <title>Processing...</title>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #d2e0fb, #fef9f7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(12px)",
            padding: "2rem 3rem",
            borderRadius: "1rem",
            textAlign: "center",
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
            maxWidth: "400px",
            width: "90%",
          }}
        >
          <img
            src="/loading.gif"
            alt="Loading"
            style={{ width: "48px", marginBottom: "1rem" }}
          />
          <h2 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#333", marginBottom: "0.5rem" }}>
            Please wait...
          </h2>
          <p style={{ fontSize: "14px", color: "#666" }}>
            We're completing your Google authentication.
          </p>
        </div>
      </div>
    </>
  );
};

export default GoogleCallbackPage;
