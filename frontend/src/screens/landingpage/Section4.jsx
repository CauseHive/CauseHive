import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import styles from './styles.module.css';
import apiService from '../../services/apiService';

const Section4Content = () => {
  const [donationData, setDonationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDonations();
        setDonationData(data.results || data);
      } catch (error) {
        console.error('Error fetching donations:', error);
        setError('Failed to load donations');
        // Fallback to mock data if API fails
        setDonationData([
          {
            id: 1,
            title: "Help Azar to continue his study",
            category: "Education",
            goal: 50000,
            collected: 30000,
            remaining: 20000,
            progress: 60,
            image: require('./assets/section4_image1.png'),
            categoryColor: '#4CAF50',
            categoryTextColor: '#white'
          },
          {
            id: 2,
            title: "Build School for poor students",
            category: "School Construction",
            goal: 100000,
            collected: 50000,
            remaining: 50000,
            progress: 50,
            image: require('./assets/section4_image2.png'),
            categoryColor: '#2196F3',
            categoryTextColor: '#white'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleDonateClick = async (donationId) => {
    try {
      // This would typically open a donation modal or redirect to donation page
      console.log(`Donating to cause: ${donationId}`);
      // Example: redirect to donation page
      // window.location.href = `/donate/${donationId}`;
    } catch (error) {
      console.error('Error initiating donation:', error);
    }
  };

  return (
    <section className={styles.helpNeededSection}>
      <button className={styles.donateLabel}>DONATE</button>
      <h2 className={styles.helpNeededHeading}>Your help is Needed</h2>
      
      {loading ? (
        <div className={styles.loadingMessage}>Loading donations...</div>
      ) : error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : (
        <div className={styles.helpCards}>
          {donationData.map((donation, index) => (
            <div key={donation.id || index} className={styles.helpCard}>
              <img 
                src={donation.image || require('./assets/section4_image1.png')} 
                alt={donation.title} 
                className={styles.helpCardImage} 
              />
              <div className={styles.helpCardContent}>
                <span 
                  className={styles.categoryLabel} 
                  style={{
                    backgroundColor: donation.categoryColor || '#4CAF50', 
                    color: donation.categoryTextColor || '#white'
                  }}
                >
                  {donation.category}
                </span>
                <h3 className={styles.helpCardTitle}>{donation.title}</h3>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progress} 
                    style={{ 
                      width: `${donation.progress || 0}%`, 
                      backgroundColor: '#8bc53f' 
                    }}
                  ></div>
                </div>
                <div className={styles.progressDetails}>
                  <div>
                    <div className={styles.progressLabel}>Goal</div>
                    <div className={styles.progressValue}>₹{donation.goal || 0}</div>
                  </div>
                  <div>
                    <div className={styles.progressLabel}>Collected</div>
                    <div className={styles.progressValue}>₹{donation.collected || 0}</div>
                  </div>
                  <div>
                    <div className={styles.progressLabel}>Remaining</div>
                    <div className={styles.progressValue}>₹{donation.remaining || 0}</div>
                  </div>
                </div>
                <div className={styles.helpCardActions}>
                  <button 
                    className={styles.donateBtn}
                    onClick={() => handleDonateClick(donation.id)}
                  >
                    DONATE <span className={styles.heartIcon}>♥</span>
                  </button>
                  <button className={styles.forwardButton}>&rarr;</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <h2 className={styles.donateSupportHeading}>Donate to support Causes</h2>
    </section>
  );
};

const Section4 = () => (
  <ErrorBoundary>
    <Section4Content />
  </ErrorBoundary>
);
export default Section4;
