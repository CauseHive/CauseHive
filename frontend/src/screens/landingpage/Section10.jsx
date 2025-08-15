import React from 'react';
import styles from './styles.module.css';
import facebookIcon from '../../assets/facebook-logo.svg';
import twitterIcon from '../../assets/twitter-logo.svg';

const instagramIconUrl = "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png";

const Section10 = () => {
  return (
    <footer className={styles.section10Container}>
      <div className={styles.socialIcons}>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <img src={facebookIcon} alt="Facebook" className={styles.socialIcon} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.twitterLink}>
          <img src={twitterIcon} alt="Twitter" className={styles.socialIcon} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <img src={instagramIconUrl} alt="Instagram" className={styles.socialIcon} />
        </a>
      </div>
      <div className={styles.copyrightText}>
        © 2025 CauseHive. All rights reserved.
      </div>
    </footer>
  );
};

export default Section10;
