import React, { useState } from 'react';
import styles from './styles.module.css';
import PaulStatamImage from '../../assets/PaulStatamImage.png'; // Assuming the image is in the assets folder

const CauseReviewPage = () => {
  const [timeFrame, setTimeFrame] = useState('One week');

  const pendingCauses = Array(5).fill().map((_, index) => (
    <div key={index} className={styles.pendingCause}>
      <input type="checkbox" className={styles.checkbox} />
      <div className={styles.causePlaceholder}></div>
    </div>
  ));

  const handleIconClick = (item) => {
    console.log(`${item} clicked`);
    // Add your click handler logic here
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
    <button type="button" onClick={() => handleIconClick('Menu')} className={styles.menuIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <rect y="6" width="24" height="2" rx="1" />
            <rect y="11" width="24" height="2" rx="1" />
            <rect y="16" width="24" height="2" rx="1" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('Dashboard')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <rect width="18" height="18" x="3" y="3" rx="2" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('Products')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <rect width="12" height="12" x="6" y="6" rx="2" />
            <rect width="12" height="12" x="6" y="6" rx="2" transform="rotate(45 12 12)" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('Favorites')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('Inbox')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('Order Lists')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V6h10v2z" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('Product Stock')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M11 9h2V6h-2v3zm-4 0h2V6H7v3zm4 0h2V6h-2v3zm8-4v16H5V5h14m0-2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('File Manager')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('Calender')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V8h14v12z" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('TO - DO')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 3h2v2h-2V6zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('Contact')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2zm0-3H6V4h12v2z" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('Invoice')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V6h10v2z" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('Profile')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('Settings')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.47-.12-.61l-2.03-1.58zm-5.14 1.06c-1.6 0-2.9-1.3-2.9-2.9s1.3-2.9 2.9-2.9 2.9 1.3 2.9 2.9-1.3 2.9-2.9 2.9z" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('UI Elements')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M3 13h8v8H3zm0-10h8v8H3zm10 0h8v8h-8zm0 10h8v8h-8z" />
          </svg>
    </button>
    <button type="button" onClick={() => handleIconClick('Logout')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
    </button>
      </aside>
      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>Pending Causes</h2>
        <div className={styles.pendingCauses}>{pendingCauses}</div>
        <div className={styles.statsContainer}>
          <div className={styles.statsLeft}>
            <h3 className={styles.subSectionTitle}>Causes reviewed in</h3>
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className={styles.timeFrameSelect}
            >
              <option>One week</option>
              <option>One month</option>
              <option>Three months</option>
            </select>
            <p className={styles.stat}>Total accepted:</p>
            <p className={styles.stat}>Total rejected:</p>
            <p className={styles.stat}>Total pending:</p>
          </div>
          <div className={styles.statsRight}>
            <h3 className={styles.subSectionTitle}>Active Causes</h3>
          </div>
        </div>
      </main>
      <img src={PaulStatamImage} alt="Profile" className={styles.profileIcon} />
    </div>
  );
};

export default CauseReviewPage;