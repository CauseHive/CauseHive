import React from 'react';
import styles from './styles.module.css';
import Section5Image1 from './assets/section5_image1.png';
import Section5Image2 from './assets/Section5_image2.png';
import Section5Image3 from './assets/Section5_image3.png';
import Section5Image4 from './assets/Section5_image4.png';
import Section5Image5 from './assets/Section5_image5.png';

const Section5 = () => {
  return (
    <section className={styles.section5Container}>
      <div className={styles.section5TextBlock}>
        <button className={styles.successStoriesLabel}>SUCCESS STORIES</button>
        <h2 className={styles.section5MainHeading}>By you It’s happened</h2>
        <p className={styles.section5Description}>
          Lorem Ipsum is simply dummy text of the printing typesetting dummy text ever when an unknown printer took a galley of type and scrambled a type specimen book.
        </p>
      </div>
      <div className={styles.section5Grid}>
        <div className={styles.section5LargeImageContainer}>
          <img src={Section5Image3} alt="Success story 3" className={styles.section5LargeImage} />
          <div className={styles.imageOverlay}>
            <div className={styles.imageTitle}>Title</div>
            <div className={styles.imageSubtext}>Subtext</div>
            <a href="#" className={styles.knowMoreLink}>
              Know more <span className={styles.arrow}>&rarr;</span>
            </a>
          </div>
        </div>
        <div className={styles.section5SmallImagesContainer}>
          <div className={styles.section5SmallImageWrapper}>
            <img src={Section5Image2} alt="Success story 2" className={styles.section5SmallImage} />
            <div className={styles.imageOverlay}>
              <div className={styles.imageTitle}>Title</div>
              <div className={styles.imageSubtext}>Subtext</div>
              <a href="#" className={styles.knowMoreLink}>
                Know more <span className={styles.arrow}>&rarr;</span>
              </a>
            </div>
          </div>
          <div className={styles.section5SmallImageWrapper}>
            <img src={Section5Image1} alt="Success story 1" className={styles.section5SmallImage} />
            <div className={styles.imageOverlay}>
              <div className={styles.imageTitle}>Title</div>
              <div className={styles.imageSubtext}>Subtext</div>
              <a href="#" className={styles.knowMoreLink}>
                Know more <span className={styles.arrow}>&rarr;</span>
              </a>
            </div>
          </div>
          <div className={styles.section5SmallImageWrapper}>
            <img src={Section5Image4} alt="Success story 4" className={styles.section5SmallImage} />
            <div className={styles.imageOverlay}>
              <div className={styles.imageTitle}>Title</div>
              <div className={styles.imageSubtext}>Subtext</div>
              <a href="#" className={styles.knowMoreLink}>
                Know more <span className={styles.arrow}>&rarr;</span>
              </a>
            </div>
          </div>
          <div className={styles.section5SmallImageWrapper}>
            <img src={Section5Image5} alt="Success story 5" className={styles.section5SmallImage} />
            <div className={styles.imageOverlay}>
              <div className={styles.imageTitle}>Title</div>
              <div className={styles.imageSubtext}>Subtext</div>
              <a href="#" className={styles.knowMoreLink}>
                Know more <span className={styles.arrow}>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <span className={styles.section5CallToAction}>We want to support and hear more stories like these</span>
      <form className={styles.section5SubscriptionForm}>
        <div className={styles.subscriptionContainer}>
          <div className={styles.subscriptionText}>
            <label htmlFor="email" className={styles.subscriptionLabel}>Get update on success stories</label>
            <p className={styles.subscriptionSubtext}>Get directly on your email</p>
          </div>
          <div className={styles.subscriptionInputGroup}>
            <input type="email" id="email" name="email" placeholder="Enter your email" className={styles.subscriptionInput} />
            <button type="submit" className={styles.subscriptionButton}>Subscribe</button>
          </div>
        </div>
        <p className={styles.privacyPolicyText}>
          We care about your data in our <a href="#" className={styles.privacyPolicyLink}>privacy policy</a>.
        </p>
      </form>
      <div className={styles.section5Placeholder}>
        {/* Placeholder text or content under images */}
        <p>Placeholder text or additional content here</p>
      </div>
    </section>
  );
};

export default Section5;
