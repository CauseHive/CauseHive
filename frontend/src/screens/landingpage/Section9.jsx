import React from 'react';
import styles from './styles.module.css';

const Section9 = () => {
  return (
    <footer className={styles.section9Container}>
      <div className={styles.logoText}>CauseHive.</div>
      <nav className={styles.footerNav}>
    <button type="button" className={styles.footerLink}>About</button>
    <button type="button" className={styles.footerLink}>Services</button>
    <button type="button" className={styles.footerLink}>Join Us</button>
    <button type="button" className={styles.footerLink}>Contact</button>
    <button type="button" className={styles.footerLink}>Help</button>
    <button type="button" className={styles.footerLink}>Privacy</button>
      </nav>
    </footer>
  );
};

export default Section9;
