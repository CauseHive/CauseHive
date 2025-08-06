import React from 'react';
import styles from './styles.module.css';
import Section6Image from './assets/section6_image.png';

const Section6 = () => {
  return (
    <section className={styles.section6Container}>
      <div className={styles.volunteersLabel}>VOLUNTEERS</div>
      <h2 className={styles.section6Heading}>Recent contributors</h2>
      <div className={styles.contributorsContainer}>
        <div className={styles.contributorCard}>
          <div className={styles.contributorIcon}>
            <img src={Section6Image} alt="Contributor" className={styles.contributorImage} />
          </div>
          <div className={styles.contributorInfo}>
            <div className={styles.contributorName}>Syed</div>
            <div className={styles.contributorLocation}>Salem</div>
          </div>
        </div>
        <div className={styles.contributorCard}>
          <div className={styles.contributorIcon}>
            <img src={Section6Image} alt="Contributor" className={styles.contributorImage} />
          </div>
          <div className={styles.contributorInfo}>
            <div className={styles.contributorName}>John</div>
            <div className={styles.contributorLocation}>Madurai</div>
          </div>
        </div>
        <div className={styles.contributorCard}>
          <div className={styles.contributorIcon}>
            <img src={Section6Image} alt="Contributor" className={styles.contributorImage} />
          </div>
          <div className={styles.contributorInfo}>
            <div className={styles.contributorName}>Ram</div>
            <div className={styles.contributorLocation}>Chennai</div>
          </div>
        </div>
        <div className={styles.contributorCard}>
          <div className={styles.contributorIcon}>
            <img src={Section6Image} alt="Contributor" className={styles.contributorImage} />
          </div>
          <div className={styles.contributorInfo}>
            <div className={styles.contributorName}>Muthu</div>
            <div className={styles.contributorLocation}>Bangalore</div>
          </div>
        </div>
      </div>
      <button className={styles.registerButton}>
        REGISTER NOW <span className={styles.heartIcon}>♥</span>
      </button>
    </section>
  );
};

export default Section6;
