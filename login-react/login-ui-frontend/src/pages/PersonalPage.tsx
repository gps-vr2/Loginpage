import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const PersonalPage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div style={styles.wrapper}>
        <title>Loading...</title>
        <p style={styles.loadingText}>Loading user information...</p>
      </div>
    );
  }

  return (
    <>
      <title>Personal Info</title>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h1 style={styles.heading}>👋 Welcome, {user.name || user.email}!</h1>
          <p style={styles.subText}>This is your personal information page.</p>
          <p style={styles.detail}>User ID: <span style={styles.highlight}>{user.id}</span></p>

          <button onClick={logout} style={styles.logoutBtn}>
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    height: "100vh",
    width: "100vw",
    background: "#f3f6fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: "16px",
  },
  card: {
    background: "#ffffff",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#222",
  },
  subText: {
    fontSize: "14px",
    color: "#444",
    marginBottom: "12px",
  },
  detail: {
    fontSize: "13px",
    color: "#333",
    marginBottom: "24px",
  },
  highlight: {
    fontWeight: "bold",
    color: "#3a3a3a",
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
  loadingText: {
    fontSize: "16px",
    color: "#666",
  }
};

export default PersonalPage;
