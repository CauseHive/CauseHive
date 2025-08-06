import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

const Section4 = () => {
  const [donationData, setDonationData] = useState([]);

  useEffect(() => {
    fetch('/api/donations/statistics/')
      .then(response => response.json())
      .then(data => setDonationData(data))
      .catch(error => console.error('Error fetching donation statistics:', error));
  }, []);

  return (
    <section className={styles.helpNeededSection}>
      <button className={styles.donateLabel}>DONATE</button>
      <h2 className={styles.helpNeededHeading}>Your help is Needed</h2>
      <div className={styles.helpCards}>
        {donationData.map((donation, index) => (
          <div key={index} className={styles.helpCard}>
            <img src={donation.image} alt={donation.title} className={styles.helpCardImage} />
            <div className={styles.helpCardContent}>
              <span className={styles.categoryLabel} style={{backgroundColor: donation.categoryColor, color: donation.categoryTextColor}}>{donation.category}</span>
              <h3 className={styles.helpCardTitle}>{donation.title}</h3>
              <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: `${donation.progress}%`, backgroundColor: '#8bc53f' }}></div>
              </div>
              <div className={styles.progressDetails}>
                <div>
                  <div className={styles.progressLabel}>Goal</div>
                  <div className={styles.progressValue}>₹{donation.goal}</div>
                </div>
                <div>
                  <div className={styles.progressLabel}>Collected</div>
                  <div className={styles.progressValue}>₹{donation.collected}</div>
                </div>
                <div>
                  <div className={styles.progressLabel}>Remaining</div>
                  <div className={styles.progressValue}>₹{donation.remaining}</div>
                </div>
              </div>
              <div className={styles.helpCardActions}>
                <button className={styles.donateButton}>
                  DONATE <span className={styles.heartIcon}>♥</span>
                </button>
                <button className={styles.forwardButton}>&rarr;</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 className={styles.donateSupportHeading}>Donate to support Causes</h2>
    </section>
  );
};

export default Section4;
