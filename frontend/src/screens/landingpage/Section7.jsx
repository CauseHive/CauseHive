import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import styles from './styles.module.css';
import apiService from '../../services/apiService';

const Section7Content = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch testimonials
        const testimonialsResponse = await apiService.getTestimonials();
        const fetchedTestimonials = testimonialsResponse.results || testimonialsResponse;
        
        // Fetch statistics
        const statsResponse = await apiService.getStatistics();
        const fetchedStats = statsResponse.results || statsResponse;
        
        setTestimonials(fetchedTestimonials.length > 0 ? fetchedTestimonials : [
          {
            id: 1,
            text: "contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC",
            author: "Syed",
          },
          {
            id: 2,
            text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            author: "Alex",
          },
          {
            id: 3,
            text: "It has survived not only five centuries, but also the leap into electronic typesetting.",
            author: "Maria",
          },
        ]);
        
        setStats(fetchedStats.length > 0 ? fetchedStats : [
          {
            id: 1,
            value: "0%",
            title: "Platform charge",
            description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
          },
          {
            id: 2,
            value: "12k+ GHC",
            title: "Donations given",
            description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
          },
          {
            id: 3,
            value: "16k+ ",
            title: "Active Donors",
            description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
          },
          {
            id: 4,
            value: "20K+",
            title: "Success stories",
            description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
          },
        ]);
      } catch (error) {
        console.error('Error fetching testimonials and stats:', error);
        // Set fallback data
        setTestimonials([
          {
            id: 1,
            text: "contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC",
            author: "Syed",
          },
          {
            id: 2,
            text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            author: "Alex",
          },
          {
            id: 3,
            text: "It has survived not only five centuries, but also the leap into electronic typesetting.",
            author: "Maria",
          },
        ]);
        
        setStats([
          {
            id: 1,
            value: "0%",
            title: "Platform charge",
            description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
          },
          {
            id: 2,
            value: "12k+ GHC",
            title: "Donations given",
            description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
          },
          {
            id: 3,
            value: "16k+ ",
            title: "Active Donors",
            description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
          },
          {
            id: 4,
            value: "20K+",
            title: "Success stories",
            description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDotClick = (index) => {
    setCurrentTestimonial(index);
  };

  return (
    <section className={styles.section7Container}>
      <button className={styles.section7TestimonialLabel}>TESTIMONIALS</button>
      <h2 className={styles.section7MainHeading}>What people says about us</h2>
      {loading ? (
        <div className={styles.loadingMessage}>Loading testimonials...</div>
      ) : (
        <div className={styles.section7TestimonialBox}>
          <div className={styles.quoteMark}>&ldquo;&rdquo;</div>
          <p className={styles.testimonialText}>
            {testimonials[currentTestimonial]?.text || testimonials[currentTestimonial]?.content || ''}
          </p>
          <div className={styles.testimonialAuthor}>
            {testimonials[currentTestimonial]?.author || 
             testimonials[currentTestimonial]?.user?.first_name ||
             testimonials[currentTestimonial]?.name ||
             'Anonymous'}
          </div>
          <div className={styles.testimonialDots}>
            {testimonials.map((_, index) => (
              <span
                key={index}
                className={`${styles.testimonialDot} ${index === currentTestimonial ? styles.activeDot : ''}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>
      )}
      <div className={styles.section7Stats}>
        {stats.map((stat) => (
          <div key={stat.id || stat.title} className={styles.statItem}>
            <div className={styles.statValue}>
              {stat.value || stat.amount || stat.count || '0'}
            </div>
            <div className={styles.statTitle}>
              {stat.title || stat.label || stat.name || ''}
            </div>
            <div className={styles.statDescription}>
              {stat.description || 'No description available'}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Section7 = () => (
  <ErrorBoundary>
    <Section7Content />
  </ErrorBoundary>
);
export default Section7;
