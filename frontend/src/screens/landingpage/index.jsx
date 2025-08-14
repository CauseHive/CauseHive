import React from 'react';
import styles from './styles.module.css';
import NewHeroImage1 from './assets/New_Hero_Section_Image1.png';
import HeroImage2 from './assets/Hero_Section_Image2.png';
import Section3Image1 from './assets/Section_3_image1.png';
import Section3Image2 from './assets/Section_3_image2.png';
import Section3Image3 from './assets/Section_3_image3.png';
import Section4 from './Section4';
import Section5 from './Section5';
import Section6 from './Section6';
import Section7 from './Section7';
import Section8 from './Section8';
import Section9 from './Section9';
import Section10 from './Section10';

const LandingPage = () => {
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>CauseHive.</div>
        <div className={styles.navbarRight}>
          <a href="#" className={styles.navLink}>Home</a>
          <a href="#" className={styles.navLink}>
            Services
            <i className={styles.dropdownArrow}></i>
          </a>
          <a href="#" className={styles.navLink}>
            Join us
            <i className={styles.dropdownArrow}></i>
          </a>
          <a href="#" className={styles.navLink}>Contact us</a>
          <a href="#" className={styles.loginLink}>Log in</a>
          <button className={styles.donateButton}>Donate</button>
        </div>
      </nav>

      <section className={styles.heroSection}>
        <div className={styles.heroTextContainer}>
          <h1 className={styles.heroHeading}>
            Seeking Financial Aid for Medical Emergencies or Social Causes?
          </h1>
          <div className={styles.heroButtons}>
            <a href="/request-donation" className={styles.requestDonationButton} role="button">REQUEST DONATION</a>
            <a href="/donate-and-help" className={styles.donateAndHelpButton} role="button">DONATE AND HELP</a>
          </div>
          <h2 className={styles.changeLivesHeading}>Change lives and communities</h2>
        </div>
        <div className={styles.curvedImageContainer}>
          <img src={NewHeroImage1} alt="Volunteers" className={styles.curvedImage} />
        </div>
      </section>

      <section className={styles.curvedImageContainer}>
        <img src={HeroImage2} alt="Children smiling" className={styles.curvedImage} />
      </section>

      {/* Section 3 */}
      <section className={styles.servicesSection}>
        <button className={styles.servicesLabel}>OUR SERVICES</button>
        <h2 className={styles.servicesHeading}>Use our platform</h2>
        <div className={styles.servicesCards}>
          <div className={styles.serviceCard}>
            <div className={`${styles.serviceIconContainer} ${styles.serviceIcon1}`}>
              <img src={Section3Image1} alt="Create a cause" className={styles.serviceIcon} />
            </div>
            <div className={styles.serviceTitle}>Create a cause</div>
            <a href="#" className={styles.serviceLink}>
              Create Cause <i className={styles.serviceLinkArrow}></i>
            </a>
          </div>
          <div className={styles.serviceCard}>
            <div className={`${styles.serviceIconContainer} ${styles.serviceIcon2}`}>
              <img src={Section3Image2} alt="Donate to causes" className={styles.serviceIcon} />
            </div>
            <div className={styles.serviceTitle}>Donate to causes</div>
            <a href="#" className={styles.serviceLink}>
              Donate <i className={styles.serviceLinkArrow}></i>
            </a>
          </div>
          <div className={styles.serviceCard}>
            <div className={`${styles.serviceIconContainer} ${styles.serviceIcon3}`}>
              <img src={Section3Image3} alt="Give us your feedback" className={styles.serviceIcon} />
            </div>
            <div className={styles.serviceTitle}>Give us your feedback</div>
            <a href="#" className={styles.serviceLink}>
              Feedback <i className={styles.serviceLinkArrow}></i>
            </a>
          </div>
        </div>
      </section>
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Section8 />
      <Section9 />
      <Section10 />
    </>
  );
};

export default LandingPage;
