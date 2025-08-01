import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_URL = "https://loginpage-1.vercel.app/api";

const MainAppPage = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [userName, setUserName] = useState(user?.name || "Guest");
  const [congNumber, setCongNumber] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/getuser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.congregationNumber) {
          setCongNumber(res.data.congregationNumber);
        }
      } catch (err) {
        console.error("Failed to fetch user details", err);
      }
    };

    fetchUserDetails();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLaunch = (link?: string) => {
    if (link) window.location.href = link;
  };

  return (
    <>
      <title>Main Application</title>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>

          <div style={styles.header}>
            <h2 style={styles.title}>Welcome, {userName}</h2>
            <p style={styles.subText}>
              Your Congregation Number:{" "}
              <span style={styles.highlight}>{congNumber || "Loading..."}</span>
            </p>
          </div>

          <div style={styles.appList}>
            {[
              { img: "/logo_app1.png", title: "APP1 - DESC", link: "https://gpsapp1.vercel.app/" },
              { img: "/logo_app2.png", title: "APP2 - DESC", link: "https://gp-sapp2.vercel.app" },
              { img: "/logo1.png", title: "APP3 - DESC" },
              { img: "/admin.png", title: "ADMIN LOGIN" },
            ].map((app, idx) => (
              <div key={idx} style={styles.appBox}>
                <img src={app.img} alt={app.title} style={styles.appImg} />
                <div style={styles.appRight}>
                  <p style={styles.appTitle}>{app.title}</p>
                  <button
                    style={{
                      ...styles.launchBtn,
                      backgroundColor: app.link ? "#7064e5" : "#bbb",
                      cursor: app.link ? "pointer" : "not-allowed",
                    }}
                    onClick={() => handleLaunch(app.link)}
                    disabled={!app.link}
                  >
                    Launch
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.footer}>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout and use another account
            </button>
          </div>
        </div>

        <div style={styles.sideImage}>
          <img src="/logo1.png" alt="Visual" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(to bottom right, #e5eaf5, #d7f2f0)",
    overflow: "hidden",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    margin: "auto",
    padding: 30,
    background: "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(16px)",
    borderRadius: 20,
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    top: 15,
    left: 20,
    fontSize: 12,
    background: "none",
    border: "none",
    color: "#7064e5",
    cursor: "pointer",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
    color: "#1f1f1f",
  },
  subText: {
    fontSize: 13,
    color: "#555",
  },
  highlight: {
    color: "#5e5ccf",
    fontWeight: 600,
  },
  appList: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  appBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    borderRadius: 12,
    padding: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.07)",
  },
  appImg: {
    width: 80,
    height: 70,
    objectFit: "cover",
    borderRadius: 10,
  },
  appRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  appTitle: {
    fontSize: 13.5,
    fontWeight: 600,
    marginBottom: 6,
    color: "#222",
  },
  launchBtn: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "none",
    fontSize: 12,
    color: "white",
    fontStyle: "italic",
    transition: "all 0.3s",
  },
  footer: {
    marginTop: "auto",
    textAlign: "center",
    paddingTop: 24,
  },
  logoutBtn: {
    fontSize: 13,
    color: "#7064e5",
    border: "none",
    background: "none",
    cursor: "pointer",
    textDecoration: "underline",
  },
  sideImage: {
    display: "none",
    width: "50%",
    height: "100%",
  },
};

// Media Query fallback
if (window.innerWidth > 768) {
  styles.sideImage.display = "block";
}

export default MainAppPage;
