import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import apiService from '../../services/apiService';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await apiService.getNotifications();
        setNotifications(data.results);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {/* ... sidebar icons ... */}
      </aside>
      <main className={styles.mainContent}>
        <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>Back</button>
        <header className={styles.header}>
          <h1 className={styles.title}>Your notifications</h1>
          {/* ... header icons ... */}
        </header>
        <section className={styles.notificationsSection}>
          {notifications.map((notification) => (
            <div key={notification.id} className={styles.notificationItem}>
              <span className={styles.notificationDot}></span>
              <div className={styles.notificationText}>{notification.message}</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default NotificationsPage;