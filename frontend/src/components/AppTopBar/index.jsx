import React from 'react';
import styles from './styles.module.css';

const AppTopBar = ({ brand = 'CauseHive.', showBrand = true, onBack, onCart, onAvatar, avatarUrl }) => {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        {onBack ? (
          <button className={styles.back} onClick={onBack} aria-label="Back">← Back</button>
        ) : null}
        {showBrand ? <div className={styles.brand}>{brand}</div> : null}
      </div>
      <div className={styles.right}>
        {onCart ? (
          <button className={styles.iconBtn} onClick={onCart} aria-label="Cart">🛒</button>
        ) : null}
        {onAvatar ? (
          <button className={styles.avatarBtn} onClick={onAvatar} aria-label="Profile">
            {avatarUrl ? <img src={avatarUrl} alt="Profile" className={styles.avatarImg} /> : '👤'}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default AppTopBar;

