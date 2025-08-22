import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Grid, Heart, MessageSquare, Layers, Calendar, User, Settings, LogOut } from "lucide-react";

const SidebarNav = () => {
  const navigate = useNavigate();
  const go = (path) => () => navigate(path);
  const logout = () => {
    try {
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
      window.localStorage.removeItem('user_id');
      window.localStorage.removeItem('cart_id');
    } catch (_) {}
    navigate('/');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        <button className={styles.menuBtn} aria-label="Menu">☰</button>
      </div>
      <nav className={styles.nav} aria-label="Main">
        <button className={styles.navItem} aria-label="Dashboard" onClick={go('/dashboard')}><Grid size={20} /></button>
        <button className={styles.navItem} aria-label="Favorites" onClick={go('/desktoppage')}><Heart size={20} /></button>
        <button className={styles.navItem} aria-label="Notifications" onClick={go('/notificationspage')}><MessageSquare size={20} /></button>
        <button className={styles.navItem} aria-label="Causes" onClick={go('/causelistpage')}><Layers size={20} /></button>
        <button className={styles.navItem} aria-label="Create Cause" onClick={go('/causes/create')}><Calendar size={20} /></button>
      </nav>
      <div className={styles.sidebarBottom}>
        <button className={styles.navItem} aria-label="Profile" onClick={go('/profilepage')}><User size={20} /></button>
        <button className={styles.navItem} aria-label="Settings" onClick={go('/profilesettings')}><Settings size={20} /></button>
        <button className={styles.navItem} aria-label="Logout" onClick={logout}><LogOut size={20} /></button>
      </div>
    </aside>
  );
};

export default SidebarNav;

