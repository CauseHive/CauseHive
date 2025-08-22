import React, { useEffect, useMemo, useState, useRef } from 'react';
import WebSocketClient from '../../utils/WebSocketClient';
import styles from './styles.module.css';
import SidebarNav from '../../components/SidebarNav';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { useToast } from '../../components/Toast/ToastProvider';
import AppTopBar from '../../components/AppTopBar';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const wsRef = useRef(null);

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

    // WebSocket integration for live notifications
    wsRef.current = new WebSocketClient(
      (msg) => {
        try {
          const data = JSON.parse(msg);
          if (data && data.type === 'notification') {
            setItems(prev => [{
              id: data.id || Date.now(),
              message: data.message,
              cause: data.cause || '',
            }, ...prev]);
            toast.info('New notification received');
          }
        } catch (err) {
          // Ignore invalid messages
        }
      },
      () => { /* onOpen */ },
      () => { /* onClose */ },
      (err) => { toast.error('WebSocket error'); }
    );
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [toast]);

  const filtered = useMemo(() => {
    if (!searchTerm) return items;
    const s = searchTerm.toLowerCase();
    return (items || []).filter(n => (String(n.message || '').toLowerCase().includes(s) || String(n.cause || '').toLowerCase().includes(s)));
  }, [items, searchTerm]);

  return (
    <div className={styles.container}>
      <SidebarNav />
      <main className={styles.mainContent}>
        <AppTopBar
          onBack={()=> navigate(-1)}
          onCart={()=> navigate('/cartpage')}
          onAvatar={()=> navigate('/profilepage')}
          avatarUrl={profile && profile.profile_picture ? `${apiService.baseURL}${profile.profile_picture}` : undefined}
        />
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
          </div>
        </header>
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
