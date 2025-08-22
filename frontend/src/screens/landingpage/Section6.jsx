import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import styles from './styles.module.css';
import Section6Image from './assets/section6_image.png';
import apiService from '../../services/apiService';

const Section6Content = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true);
        const data = await apiService.getContributors();
        setContributors(data.results || data);
      } catch (error) {
        console.error('Error fetching contributors:', error);
        // Fallback to default contributors
        setContributors([
          { id: 1, name: "Syed", location: "Salem", image: Section6Image },
          { id: 2, name: "John", location: "Madurai", image: Section6Image },
          { id: 3, name: "Ram", location: "Chennai", image: Section6Image },
          { id: 4, name: "Muthu", location: "Bangalore", image: Section6Image }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  const handleRegisterClick = () => {
    window.open('/register', '_blank');
  };
  return (
    <section className={styles.section6Container}>
      <div className={styles.volunteersLabel}>VOLUNTEERS</div>
      <h2 className={styles.section6Heading}>Recent contributors</h2>
      <div className={styles.contributorsContainer}>
        {loading ? (
          <div className={styles.loadingMessage}>Loading contributors...</div>
        ) : (
          contributors.map((contributor) => (
            <div key={contributor.id} className={styles.contributorCard}>
              <div className={styles.contributorIcon}>
                <img 
                  src={contributor.image || contributor.profile_picture || Section6Image} 
                  alt={contributor.name || contributor.first_name || "Contributor"} 
                  className={styles.contributorImage} 
                />
              </div>
              <div className={styles.contributorInfo}>
                <div className={styles.contributorName}>
                  {contributor.name || `${contributor.first_name || ''} ${contributor.last_name || ''}`.trim() || 'Anonymous'}
                </div>
                <div className={styles.contributorLocation}>
                  {contributor.location || contributor.city || 'Location not specified'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <button 
        className={styles.registerButton}
        onClick={handleRegisterClick}
      >
        REGISTER NOW <span className={styles.heartIcon}>♥</span>
      </button>
    </section>
  );
};

const Section6 = () => (
  <ErrorBoundary>
    <Section6Content />
  </ErrorBoundary>
);
export default Section6;
