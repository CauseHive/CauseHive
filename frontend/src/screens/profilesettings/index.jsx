import React from 'react';
import styles from './styles.module.css';

const profilesettings = () => {
  return (
    <div className={styles.container}>
      {/* Sidebar Section */}
      <aside className={styles.sidebar}>
        <div className={styles.menuIcon}>☰</div>
        <div className={styles.icon}>💙</div>
        <div className={styles.icon}>💬</div>
        <div className={styles.icon}>⏳</div>
        <div className={styles.icon}>📅</div>
        <div className={styles.icon}>👤</div>
        <div className={styles.icon}>⚙️</div>
        {/* Changed last icon from plug 🔌 to power button ⏻ */}
        <div className={styles.icon}>⏻</div>
      </aside>

      {/* Main Content Section */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Paul Statham</span>
            <div className={styles.avatar}>🖤</div>
          </div>
        </header>

        {/* Settings Items */}
        <section className={styles.settingsSection}>
          <div className={styles.settingsItem}>Profile Settings</div>
          <div className={styles.settingsItem}>Notification Settings</div>
          <div className={styles.settingsItem}>Delete Account</div>
        </section>
      </main>
    </div>
  );
};

export default profilesettings;
