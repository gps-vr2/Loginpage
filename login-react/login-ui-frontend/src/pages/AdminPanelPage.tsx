import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://loginpage-1.vercel.app/api";

interface Invite {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  congregationNumber: number;
  status: string;
  createdAt: string;
}

interface AdminStats {
  pendingInvites: number;
  approvedInvites: number;
  rejectedInvites: number;
  totalUsers: number;
}

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // Fetch pending invites and stats
      const [invitesRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/admin/invites`, { headers }),
        fetch(`${API_URL}/admin/stats`, { headers })
      ]);

      if (invitesRes.status === 403) {
        setError("Admin access required. You don't have permission to view this page.");
        return;
      }

      if (invitesRes.ok && statsRes.ok) {
        const invitesData = await invitesRes.json();
        const statsData = await statsRes.json();
        setInvites(invitesData.invites || []);
        setStats(statsData);
      } else {
        setError("Failed to fetch admin data.");
      }
    } catch (err) {
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteAction = async (inviteId: number, action: 'accept' | 'reject') => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(`${API_URL}/admin/invite/${action}/${inviteId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        // Refresh data after action
        fetchData();
      } else {
        const error = await response.json();
        setError(error.error || `Failed to ${action} invite.`);
      }
    } catch (err) {
      setError(`Error ${action}ing invite.`);
    }
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to right, #d2e0fb, #fef9f7)",
      padding: "2rem 1rem",
      fontFamily: "system-ui, sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "2rem",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#111",
      marginBottom: "0.5rem",
    },
    subtitle: {
      fontSize: "14px",
      color: "#666",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      marginBottom: "2rem",
      maxWidth: "1200px",
      margin: "0 auto 2rem auto",
    },
    statCard: {
      background: "white",
      padding: "1.5rem",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      textAlign: "center",
    },
    statNumber: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#072fcf",
    },
    statLabel: {
      fontSize: "14px",
      color: "#666",
      marginTop: "0.5rem",
    },
    invitesSection: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "#111",
    },
    inviteCard: {
      background: "white",
      padding: "1.5rem",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      marginBottom: "1rem",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
      gap: "1rem",
    },
    inviteInfo: {
      display: "grid",
      gap: "0.25rem",
    },
    inviteName: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#111",
    },
    inviteEmail: {
      fontSize: "14px",
      color: "#666",
    },
    inviteDate: {
      fontSize: "12px",
      color: "#999",
    },
    actions: {
      display: "flex",
      gap: "0.5rem",
    },
    acceptBtn: {
      background: "#4CAF50",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
    },
    rejectBtn: {
      background: "#f44336",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
    },
    errorText: {
      color: "#f44336",
      textAlign: "center",
      fontSize: "14px",
      margin: "1rem 0",
    },
    noInvites: {
      textAlign: "center",
      color: "#666",
      fontSize: "14px",
      padding: "2rem",
      background: "white",
      borderRadius: "12px",
    },
    backBtn: {
      position: "absolute",
      top: "2rem",
      left: "2rem",
      background: "#072fcf",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      textDecoration: "none",
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button 
        style={styles.backBtn}
        onClick={() => navigate("/app")}
      >
        ← Back to App
      </button>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Panel</h1>
        <p style={styles.subtitle}>Manage congregation invites and users</p>
      </div>

      {error && <div style={styles.errorText}>{error}</div>}

      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.pendingInvites}</div>
            <div style={styles.statLabel}>Pending Invites</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.totalUsers}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.approvedInvites}</div>
            <div style={styles.statLabel}>Approved Invites</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.rejectedInvites}</div>
            <div style={styles.statLabel}>Rejected Invites</div>
          </div>
        </div>
      )}

      <div style={styles.invitesSection}>
        <h2 style={styles.sectionTitle}>Pending Invites</h2>
        
        {invites.length === 0 ? (
          <div style={styles.noInvites}>
            No pending invites at this time.
          </div>
        ) : (
          invites.map((invite) => (
            <div key={invite.id} style={styles.inviteCard}>
              <div style={styles.inviteInfo}>
                <div style={styles.inviteName}>{invite.name}</div>
                <div style={styles.inviteEmail}>{invite.email}</div>
                <div style={styles.inviteEmail}>WhatsApp: {invite.whatsapp}</div>
                <div style={styles.inviteDate}>
                  Requested: {new Date(invite.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={styles.actions}>
                <button
                  style={styles.acceptBtn}
                  onClick={() => handleInviteAction(invite.id, 'accept')}
                >
                  Accept
                </button>
                <button
                  style={styles.rejectBtn}
                  onClick={() => handleInviteAction(invite.id, 'reject')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanelPage;