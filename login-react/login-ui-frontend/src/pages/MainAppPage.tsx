import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_URL = "https://loginpage-1.vercel.app/api";

const MainAppPage = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [congNumber, setCongNumber] = useState("");
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLaunch = (link?: string) => {
    if (link) window.location.href = link;
  };

  const appList = [
    { img: "/logo_app1.png", title: "APP1 - DESC", link: "https://gpsapp1.vercel.app/" },
    { img: "/logo_app2.png", title: "APP2 - DESC", link: "https://gp-sapp2.vercel.app" },
    { img: "/logo1.png", title: "APP3 - DESC" },
    { img: "/admin.png", title: "ADMIN LOGIN" },
  ];

  // Shared header JSX so mobile & desktop see exactly the same greeting
  const headerSection = (
    <div
      style={{
        ...dStyles.header,
        marginTop: isMobile ? "0.5rem" : dStyles.header.marginTop,
        marginBottom: isMobile ? "1rem" : dStyles.header.marginBottom,
      }}
    >
      <h2
        style={{
          ...dStyles.title,
          fontSize: isMobile ? 18 : dStyles.title.fontSize,
        }}
      >
        Welcome, {user?.name}
      </h2>
      <p
        style={{
          ...dStyles.subText,
          fontSize: isMobile ? 12 : dStyles.subText.fontSize,
        }}
      >
        Your Congregation Number:{" "}
        <span style={dStyles.highlight}>{congNumber || "Loading..."}</span>
      </p>
    </div>
  );

  return (
    <>
      <title>Main Application</title>

      {isMobile ? (
        // ---- MOBILE: compact grid ----
        <div style={mStyles.container}>
          <div style={mStyles.topSection}>
            <img src="/logo1.png" alt="Logo" style={mStyles.logo} />
            {headerSection}
          </div>

          <div style={mStyles.appGrid}>
            {appList.map((app, idx) => (
              <div key={idx} style={mStyles.appCard}>
                <img src={app.img} alt={app.title} style={mStyles.appImg} />
                <p style={mStyles.appTitle}>{app.title}</p>
                <button
                  style={{
                    ...mStyles.launchBtn,
                    backgroundColor: app.link ? "#7064e5" : "#bbb",
                  }}
                  disabled={!app.link}
                  onClick={() => handleLaunch(app.link)}
                >
                  Launch
                </button>
              </div>
            ))}
          </div>

          <button style={mStyles.logoutBtn} onClick={handleLogout}>
            Logout and use another account
          </button>
        </div>
      ) : (
        // ---- DESKTOP ----
        <div style={dStyles.wrapper}>
          <div style={dStyles.card}>
            <button onClick={() => navigate(-1)} style={dStyles.backBtn}>
              ← Back
            </button>

            {headerSection}

            <div style={dStyles.appList}>
              {appList.map((app, idx) => (
                <div key={idx} style={dStyles.appBox}>
                  <img src={app.img} alt={app.title} style={dStyles.appImg} />
                  <div style={dStyles.appRight}>
                    <p style={dStyles.appTitle}>{app.title}</p>
                    <button
                      style={{
                        ...dStyles.launchBtn,
                        backgroundColor: app.link ? "#7064e5" : "#bbb",
                      }}
                      disabled={!app.link}
                      onClick={() => handleLaunch(app.link)}
                    >
                      Launch
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={dStyles.footer}>
              <button onClick={handleLogout} style={dStyles.logoutBtn}>
                Logout and use another account
              </button>
            </div>
          </div>

          <div style={dStyles.sideImage}>
            <img
              src="/logo1.png"
              alt="Visual"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

// ----- MOBILE styles -----
const mStyles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #e5eaf5, #d7f2f0)",
    padding: "1rem",
    fontFamily: "system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  topSection: { textAlign: "center", marginBottom: "1rem" },
  logo: { width: "90px", height: "auto", marginBottom: "0.5rem" },
  appGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "0.8rem",
    width: "100%",
    marginBottom: "1.5rem",
  },
  appCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "0.8rem 0.5rem",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  appImg: {
    width: "55px",
    height: "55px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "0.4rem",
  },
  appTitle: { fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.4rem" },
  launchBtn: {
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "0.75rem",
    padding: "4px 8px",
    cursor: "pointer",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    color: "#7064e5",
    textDecoration: "underline",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
};

// ----- DESKTOP styles -----
const dStyles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(to bottom right, #e5eaf5, #d7f2f0)",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    margin: "auto",
    padding: 30,
    background: "rgba(255, 255, 255, 0.75)",
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
  header: { textAlign: "center", marginTop: 20, marginBottom: 30 },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 6, color: "#1f1f1f" },
  subText: { fontSize: 13, color: "#555" },
  highlight: { color: "#5e5ccf", fontWeight: 600 },
  appList: { display: "flex", flexDirection: "column", gap: 18 },
  appBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffffff",
    borderRadius: 12,
    padding: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.07)",
  },
  appImg: { width: 80, height: 70, objectFit: "cover", borderRadius: 10 },
  appRight: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  appTitle: { fontSize: 13.5, fontWeight: 600, marginBottom: 6, color: "#222" },
  launchBtn: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "none",
    fontSize: 12,
    color: "white",
    fontStyle: "italic",
    transition: "all 0.3s",
  },
  footer: { marginTop: "auto", textAlign: "center", paddingTop: 24 },
  logoutBtn: {
    fontSize: 13,
    color: "#7064e5",
    border: "none",
    background: "none",
    cursor: "pointer",
    textDecoration: "underline",
  },
  sideImage: { display: "block", width: "50%", height: "100%" },
};

export default MainAppPage;
