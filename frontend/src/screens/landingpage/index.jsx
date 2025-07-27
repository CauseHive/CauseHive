import React from 'react';
import styles from './styles.module.css';
const LandingPage = () => {
  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>CauseHive.</div>
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>Home</li>
          <li className={styles.navItem}>Services ▼</li>
          <li className={styles.navItem}>Join us ▼</li>
          <li className={styles.navItem}>Contact us</li>
        </ul>
        <div className={styles.navButtons}>
          <button className={styles.navButton}>Sign Up</button>
          <button className={styles.navButton}>Login</button>
          <button className={styles.navButton}>Donate</button>
        </div>
      </nav>

      <div className={styles.donationMessageBanner}>
        <p className={styles.donationMessage}>
          Every donation brings us one step closer to a world where no one is left behind. Join us in making a lasting impact.
        </p>
      </div>

      {/* First Section */}
      <section className={styles.firstSection}>
        <div className={styles.leftPanel}>
          <h1 className={styles.donateTitle}>Donate to support Causes</h1>
          <div className={styles.reservedCircle}>
            <img src={require('./assets/sec1image1.png')} alt="Reserved circle image" className={styles.reservedCircleImage} />
          </div>
          <h2 className={styles.changeLives}>Change lives and communities</h2>
          <p className={styles.leaveMark}>Leave your mark for others to follow</p>
          <div className={styles.iconPlaceholder} aria-label="People and heart icon">
            {/* Placeholder for icon */}
          </div>
          <div>
            <button className={styles.popularCausesButton}>Popular Causes</button>
          </div>
        </div>
        <div className={styles.centerPanel}>
          <div className={styles.backgroundImagePlaceholder} aria-label="Volunteering people background">
            <img src={require('./assets/sec1_image2.png')} alt="Volunteering people" className={styles.volunteeringImage} />
            <div className={styles.footprintIconLarge} aria-label="Large footprint icon"></div>
            <div className={styles.footprintIconSmall} aria-label="Small footprint icon"></div>
          </div>
          <p className={styles.donationMessage}>
            Every donation brings us one step closer to a world where no one is left behind. Join us in making a lasting impact.
          </p>
          <div className={styles.rightPanelContent}>
            <p className={styles.firstTimerText}>First timer? Let us help you find your way around</p>
            <button className={styles.helpButton}>Help</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
