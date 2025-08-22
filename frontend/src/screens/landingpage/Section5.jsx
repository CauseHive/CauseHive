import React, { useState } from 'react';
import styles from './styles.module.css';
import Section5Image1 from './assets/section5_image1.png';
import Section5Image2 from './assets/Section5_image2.png';
import Section5Image3 from './assets/Section5_image3.png';
import Section5Image4 from './assets/Section5_image4.png';
import Section5Image5 from './assets/Section5_image5.png';
import apiService from '../../services/apiService';
import { useToast } from '../../components/Toast/ToastProvider';

/* 
// Mock success stories data (removed for API integration)
const mockSuccessStories = [
  {
    id: 1,
    title: "Sarah's Education Journey",
    subtitle: "From struggling student to university graduate",
    image: Section5Image1,
    description: "With community support, Sarah overcame financial barriers to complete her education and now works as a teacher helping other underprivileged children.",
    category: "Education",
    date: "2024-03-15",
    url: "/success-stories/sarah-education-journey"
  },
  {
    id: 2,
    title: "Medical Treatment Success",
    subtitle: "Life-saving surgery made possible",
    image: Section5Image2,
    description: "Thanks to generous donations, Ahmed received the heart surgery he desperately needed and is now living a healthy, active life.",
    category: "Healthcare",
    date: "2024-02-20",
    url: "/success-stories/ahmed-heart-surgery"
  },
  {
    id: 3,
    title: "Community Water Project",
    subtitle: "Clean water for 500 families",
    image: Section5Image3,
    description: "A successful fundraising campaign brought clean drinking water to a rural village, improving health and quality of life for hundreds of families.",
    category: "Infrastructure",
    date: "2024-01-10",
    url: "/success-stories/village-water-project"
  },
  {
    id: 4,
    title: "Small Business Empowerment",
    subtitle: "From unemployed to entrepreneur",
    image: Section5Image4,
    description: "Micro-loans and business training helped Maria start her own bakery, creating jobs for her community and supporting her family.",
    category: "Economic Empowerment",
    date: "2023-12-05",
    url: "/success-stories/maria-bakery-business"
  },
  {
    id: 5,
    title: "Disaster Relief Recovery",
    subtitle: "Rebuilding after natural disaster",
    image: Section5Image5,
    description: "After a devastating flood, community support helped rebuild homes and infrastructure, bringing hope back to affected families.",
    category: "Disaster Relief",
    date: "2023-11-18",
    url: "/success-stories/flood-recovery"
  }
];

// Mock newsletter subscription data
const mockNewsletterData = {
  subscriberCount: 15420,
  weeklyDigest: true,
  successStoriesHighlights: true,
  donationUpdates: true,
  communityNews: true
};
*/

const Section5 = () => {
  const [subscriptionEmail, setSubscriptionEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const toast = useToast();

  const handleNewsletterSubscription = async (e) => {
    e.preventDefault();
    if (!subscriptionEmail) { toast.warning('Please enter your email'); return; }

    try {
      setSubscriptionStatus('loading');
      await apiService.subscribeToNewsletter(subscriptionEmail);
      setSubscriptionStatus('success');
      setSubscriptionEmail('');
      toast.success('Subscribed to newsletter');
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      setSubscriptionStatus('error');
      toast.error('Subscription failed');
    }
  };

  return (
    <section className={styles.section5Container}>
      <div className={styles.section5TextBlock}>
        <button className={styles.successStoriesLabel}>SUCCESS STORIES</button>
        <h2 className={styles.section5MainHeading}>By you It's happened</h2>
       
      </div>
      <div className={styles.section5Grid}>
        <div className={styles.section5LargeImageContainer}>
          <img src={Section5Image3} alt="Success story 3" className={styles.section5LargeImage} />
          <div className={styles.imageOverlay}>
            <div className={styles.imageTitle}>Title</div>
            <div className={styles.imageSubtext}>Subtext</div>
            <button 
              type="button"
              className={styles.knowMoreLink}
              onClick={() => window.open('/success-stories', '_blank')}
            >
              Know more <span className={styles.arrow}>&rarr;</span>
            </button>
          </div>
        </div>
        <div className={styles.section5SmallImagesContainer}>
          <div className={styles.section5SmallImageWrapper}>
            <img src={Section5Image2} alt="Success story 2" className={styles.section5SmallImage} />
            <div className={styles.imageOverlay}>
              <div className={styles.imageTitle}>Title</div>
              <div className={styles.imageSubtext}>Subtext</div>
              <button 
                type="button"
                className={styles.knowMoreLink}
                onClick={() => window.open('/success-stories', '_blank')}
              >
                Know more <span className={styles.arrow}>&rarr;</span>
              </button>
            </div>
          </div>
          <div className={styles.section5SmallImageWrapper}>
            <img src={Section5Image1} alt="Success story 1" className={styles.section5SmallImage} />
            <div className={styles.imageOverlay}>
              <div className={styles.imageTitle}>Title</div>
              <div className={styles.imageSubtext}>Subtext</div>
              <button 
                type="button"
                className={styles.knowMoreLink}
                onClick={() => window.open('/success-stories', '_blank')}
              >
                Know more <span className={styles.arrow}>&rarr;</span>
              </button>
            </div>
          </div>
          <div className={styles.section5SmallImageWrapper}>
            <img src={Section5Image4} alt="Success story 4" className={styles.section5SmallImage} />
            <div className={styles.imageOverlay}>
              <div className={styles.imageTitle}>Title</div>
              <div className={styles.imageSubtext}>Subtext</div>
              <button 
                type="button"
                className={styles.knowMoreLink}
                onClick={() => window.open('/success-stories', '_blank')}
              >
                Know more <span className={styles.arrow}>&rarr;</span>
              </button>
            </div>
          </div>
          <div className={styles.section5SmallImageWrapper}>
            <img src={Section5Image5} alt="Success story 5" className={styles.section5SmallImage} />
            <div className={styles.imageOverlay}>
              <div className={styles.imageTitle}>Title</div>
              <div className={styles.imageSubtext}>Subtext</div>
              <button 
                type="button"
                className={styles.knowMoreLink}
                onClick={() => window.open('/success-stories', '_blank')}
              >
                Know more <span className={styles.arrow}>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <span className={styles.section5CallToAction}>We want to support and hear more stories like these</span>
      <form className={styles.section5SubscriptionForm} onSubmit={handleNewsletterSubscription}>
        <div className={styles.subscriptionContainer}>
          <div className={styles.subscriptionText}>
            <label htmlFor="email" className={styles.subscriptionLabel}>Get update on success stories</label>
            <p className={styles.subscriptionSubtext}>Get directly on your email</p>
          </div>
          <div className={styles.subscriptionInputGroup}>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email" 
              className={styles.subscriptionInput}
              value={subscriptionEmail}
              onChange={(e) => setSubscriptionEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className={styles.subscriptionButton}
              disabled={subscriptionStatus === 'loading'}
            >
              {subscriptionStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </div>
        {subscriptionStatus === 'success' && (
          <p className={styles.successMessage}>Successfully subscribed to our newsletter!</p>
        )}
        {subscriptionStatus === 'error' && (
          <p className={styles.errorMessage}>Failed to subscribe. Please try again.</p>
        )}
        <p className={styles.privacyPolicyText}>
          We care about your data in our <button type="button" className={styles.privacyPolicyLink} onClick={() => window.open('/privacy-policy', '_blank')}>privacy policy</button>.
        </p>
      </form>
      <div className={styles.section5Placeholder}>
        <p>Placeholder text or additional content here</p>
      </div>
    </section>
  );
};

export default Section5;
