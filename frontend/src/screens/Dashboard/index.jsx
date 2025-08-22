import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import {
  Bell,
  ShoppingCart,
  User,
  Grid,
  Heart,
  MessageSquare,
  Layers,
  Calendar,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import apiService from "../../services/apiService";

const Dashboard = () => {
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

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p>Error: {error}</p>;

  return (
     <div className={styles.container}>
      <aside className={styles.sidebar}>
        {/* ... sidebar ... */}
      </aside>

      <main className={styles.main}>
        <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>Back</button>
        <header className={styles.header}>
            {/* ... header ... */}
        </header>

        <div className={styles.topBar}>
          <h2 className={styles.title}>
            Dashboard <User className={styles.userIcon} />
          </h2>
          <div className={styles.iconWrapper} aria-label="Cart">
            <ShoppingCart />
            <span className={styles.badge}>2</span>
          </div>
        </div>

        <section className={styles.topSection}>
          <div className={styles.welcomeBox}>Welcome, User.</div>
          <div className={styles.causesBox}>
            <h4>Your Causes</h4>
            <div className={styles.causesCards}>
              {metrics && metrics.causes_list.slice(0, 3).map(cause => (
                <div key={cause.id} className={styles.causeCard}>{cause.title}</div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.recentDonations}>
          <h3>Your recent donations</h3>
          <div className={styles.donationsRow}>
            {metrics && metrics.donation_list.slice(0, 3).map(donation => (
                <div key={donation.id} className={styles.donationCard}>
                    <p>{donation.cause?.title || 'Cause'}</p>
                    <p>GHS {donation.amount}</p>
                </div>
            ))}
          </div>
        </section>

        <section className={styles.popularCauses}>
          <div className={styles.tableHeader}>
            <h3>Popular Causes</h3>
            <select className={styles.dropdown} aria-label="Month">
              <option>October</option>
            </select>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cause name</th>
                <th>Location</th>
                <th>Date - Time</th>
                <th>Category</th>
                <th>Amount raised</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics && metrics.causes_list.map(cause => (
                <tr key={cause.id}>
                    <td className={styles.tableCause}>
                        <span className={styles.causeIcon}>⌂</span>
                        {cause.title}
                    </td>
                    <td>{cause.location || 'N/A'}</td>
                    <td>{new Date(cause.created_at).toLocaleString()}</td>
                    <td>{cause.category?.name || 'N/A'}</td>
                    <td>{cause.current_amount}</td>
                    <td><span className={styles.status}>{cause.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
