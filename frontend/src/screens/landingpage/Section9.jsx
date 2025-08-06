import React from 'react';
import styles from './styles.module.css';

const Section9 = () => {
  return (
    <footer className={styles.section9Container}>
      <div className={styles.logoText}>CauseHive.</div>
      <nav className={styles.footerNav}>
        <a href="#" className={styles.footerLink}>About</a>
        <a href="#" className={styles.footerLink}>Services</a>
        <a href="#" className={styles.footerLink}>Join Us</a>
        <a href="#" className={styles.footerLink}>Contact</a>
        <a href="#" className={styles.footerLink}>Help</a>
        <a href="#" className={styles.footerLink}>Privacy</a>
      </nav>
    </footer>
  );
};

export default Section9;
