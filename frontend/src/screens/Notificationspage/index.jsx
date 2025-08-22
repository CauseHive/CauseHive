import React, { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.css';
import SidebarNav from '../../components/SidebarNav';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { useToast } from '../../components/Toast/ToastProvider';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      try { const p = await apiService.getProfile(); setProfile(p); } catch(_) {}
      try {
        const data = await apiService.getNotifications(1);
        const arr = Array.isArray(data) ? data : (data.results || []);
        setItems(arr);
      } catch (e) {
        // fallback demo notifications
        setItems([
          { id: 1, message: 'Your cause has been approved', cause: 'Giving to homeless children at Labadi' },
          { id: 2, message: 'New feature rolling out to all users', cause: '' },
        ]);
        toast.info('Showing sample notifications');
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) return items;
    const s = searchTerm.toLowerCase();
    return (items || []).filter(n => (String(n.message || '').toLowerCase().includes(s) || String(n.cause || '').toLowerCase().includes(s)));
  }, [items, searchTerm]);

  return (
    <div className={styles.container}>
      <SidebarNav />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Your notifications</h1>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search notifications"
              value={searchTerm}
              onChange={(e)=> setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button onClick={()=>{}} style={{ marginLeft:8, height:36, padding:'0 12px', borderRadius:8, border:'1px solid #e6e8ef', background:'#fff', cursor:'pointer' }}>Search</button>
            <div className={styles.cartIcon} onClick={()=> navigate('/cartpage')} style={{ cursor:'pointer' }}>🛒<span className={styles.cartCount}>2</span></div>
            <div className={styles.avatar} onClick={()=> navigate('/profilepage')} style={{ cursor:'pointer' }}>
              {profile && profile.profile_picture ? (
                <img src={`${apiService.baseURL}${profile.profile_picture}`} alt="User" style={{ width:28, height:28, borderRadius:999 }} />
              ) : '🖤'}
            </div>
          </div>
        </header>
        <div style={{ display:'flex', justifyContent:'flex-end', padding:'0 16px 8px' }}>
          <button onClick={()=> navigate(-1)} style={{ background:'transparent', border:'1px solid #e5e7eb', borderRadius:8, padding:'6px 10px', cursor:'pointer' }}>Back</button>
        </div>
        <section className={styles.notificationsSection}>
          {filtered.length ? filtered.map((notification) => (
            <div key={notification.id} className={styles.notificationItem}>
              <span className={styles.notificationDot}></span>
              <div className={styles.notificationText}>{notification.message || notification.title || '—'}</div>
              <div className={styles.notificationCause}>{notification.cause || ''}</div>
            </div>
          )) : (
            <div style={{ padding:12, color:'#6b7280' }}>{searchTerm ? `No notifications found for "${searchTerm}"` : 'No notifications yet.'}</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default NotificationsPage;
