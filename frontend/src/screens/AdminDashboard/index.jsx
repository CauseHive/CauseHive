import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import apiService from "../../services/apiService";
import avatarImg from "../../assets/Dashboard_image1.png";
import userBadgeImg from "../../assets/Dashboard_image2.png";

const Icon = ({ d, label }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" role="img" aria-label={label} className={styles.iconSvg}>
    <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const sidebarItems = [
  { key: "menu", label: "Menu", d: "M3 6h18M3 12h18M3 18h18" },
  { key: "dashboard", label: "Dashboard", d: "M3 13h8V3H3v10zm10 0h8V3h-8v10z" },
  // ... other items
];

const MetricsChart = ({data}) => {
    if (!data) return null;
    // This is a simplified version. A real implementation would use a library like D3 or Chart.js
    return <div className={styles.chartPlaceholder}>Chart for {data.causes_count} causes</div>;
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const data = await apiService.getDashboardMetrics();
                setMetrics(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return <p>Loading admin dashboard...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <div className={styles.layoutContainer}>
        <aside className={styles.sidebar}>
          {sidebarItems.map((item) => (
            <button key={item.key} className={styles.sideIcon} aria-label={item.label}>
              <Icon d={item.d} label={item.label} />
            </button>
          ))}
        </aside>

        <div className={styles.contentArea}>
          <header className={styles.headerBar}>
            {/* ... header ... */}
          </header>

          <main className={styles.mainContent}>
            <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>Back</button>
            <h1 className={styles.pageTitle}>
              Admin Dashboard
              <img src={userBadgeImg} alt="" className={styles.titleBadge} />
            </h1>

            <section className={styles.welcomeSection}>
              <div className={styles.welcomeCard}>Welcome, Admin.</div>
              <div className={styles.highlightCard}>
                <p>Total Donations: {metrics?.donations_stats?.total_donations || 0}</p>
                <p>Total Amount: GHS {metrics?.donations_stats?.total_amount || 0}</p>
              </div>
            </section>

            <section className={styles.pendingSection}>
              <h2 className={styles.sectionTitle}>Donations pending review</h2>
              <div className={styles.pendingRow}>
                {metrics && metrics.donation_list.filter(d => d.status === 'pending').slice(0, 4).map((donation) => (
                  <div key={donation.id} className={styles.pendingCard}>
                    <p>Cause: {donation.cause_id}</p>
                    <p>Amount: GHS {donation.amount}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.metricsSection}>
              <div className={styles.metricsHeader}>
                <h2 className={styles.metricsTitle}>Metrics</h2>
                <select className={styles.monthSelect} aria-label="Select month">
                  <option>October</option>
                </select>
              </div>
              <MetricsChart data={metrics} />
            </section>
          </main>
        </div>
      </div>
    );
};

export default AdminDashboard;
