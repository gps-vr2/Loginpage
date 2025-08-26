import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "https://loginpage-1.vercel.app/api";

const ExistPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const congregationNumber = location.state?.congregationNumber;

  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [congregationExists, setCongregationExists] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [newCongName, setNewCongName] = useState("");
  const [language, setLanguage] = useState("English");
  const [userName, setUserName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    if (!congregationNumber) {
      navigate("/");
      return;
    }

    // Check if congregation exists
    const fetchAdminEmail = async () => {
      try {
        const res = await fetch(`${API_URL}/getUserByCongregation?congId=${congregationNumber}`);
        const data = await res.json();

        if (res.ok && data.email) {
          setAdminEmail(data.email);
          setCongregationExists(true);
        } else {
          setCongregationExists(false);
        }
      } catch (err) {
        setErrorMsg("Failed to fetch congregation info.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminEmail();
  }, [congregationNumber, navigate]);

  const handleCreateNew = async () => {
    if (!userName || !whatsapp || !newCongName) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("registrationToken");
      if (!token) {
        alert("Registration token missing. Please start registration again.");
        return;
      }

      const res = await fetch(`${API_URL}/Congname`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userName,
          whatsapp,
          congregationNumber,
          congregationName: newCongName,
          language,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Congregation created successfully!");
        navigate("/dashboard"); // redirect to user dashboard
      } else {
        alert(data.error || "Failed to create congregation.");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating congregation.");
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "2rem" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.9)",
          padding: "2rem",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "450px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <img src="/logo1.png" alt="Logo" style={{ width: "140px", marginBottom: "1rem" }} />
        {congregationExists ? (
          <>
            <h3>Congregation #{congregationNumber} already exists</h3>
            <p>
              You can contact the admin for approval: <br />
              <a href={`mailto:${adminEmail}`} style={{ color: "#072fcf", textDecoration: "underline" }}>
                {adminEmail}
              </a>
            </p>
          </>
        ) : (
          <>
            <h3>Create New Congregation #{congregationNumber}</h3>
            <p>Fill the details below to become the admin:</p>
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ width: "100%", margin: "0.5rem 0", padding: "0.5rem", borderRadius: "8px" }}
            />
            <input
              type="text"
              placeholder="Whatsapp Number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              style={{ width: "100%", margin: "0.5rem 0", padding: "0.5rem", borderRadius: "8px" }}
            />
            <input
              type="text"
              placeholder="Congregation Name"
              value={newCongName}
              onChange={(e) => setNewCongName(e.target.value)}
              style={{ width: "100%", margin: "0.5rem 0", padding: "0.5rem", borderRadius: "8px" }}
            />
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: "100%", margin: "0.5rem 0", padding: "0.5rem", borderRadius: "8px" }}>
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
            </select>
            <button
              onClick={handleCreateNew}
              style={{ marginTop: "1rem", padding: "0.7rem 1.5rem", background: "#072fcf", color: "#fff", borderRadius: "8px", border: "none" }}
            >
              Create Congregation
            </button>
          </>
        )}
        {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default ExistPage;
