import React from 'react';
import { Link } from 'react-router-dom';
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
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/causelistpage" className={styles.navLink}>
            Services
            <i className={styles.dropdownArrow}></i>
          </Link>
          <Link to="/signup" className={styles.navLink}>
            Join us
            <i className={styles.dropdownArrow}></i>
          </Link>
          <Link to="#" className={styles.navLink}>Contact us</Link>
          <Link to="/sign-in" className={styles.loginLink}>Log in</Link>
          <Link to="/causelistpage" className={styles.donateBtn}>Donate</Link>
        </div>
      </nav>

      <section className={styles.heroSection}>
        <div className={styles.heroTextContainer}>
          <h1 className={styles.heroHeading}>
            Seeking Financial Aid for Medical Emergencies or Social Causes?
          </h1>
          <div className={styles.heroButtons}>
            <Link to="/causes/create" className={styles.requestDonationButton} role="button">REQUEST DONATION</Link>
            <Link to="/causelistpage" className={styles.donateAndHelpButton} role="button">DONATE AND HELP</Link>
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
            <Link to="/causes/create" className={styles.serviceLink}>
              Create Cause <i className={styles.serviceLinkArrow}></i>
            </Link>
          </div>
          <div className={styles.serviceCard}>
            <div className={`${styles.serviceIconContainer} ${styles.serviceIcon2}`}>
              <img src={Section3Image2} alt="Donate to causes" className={styles.serviceIcon} />
            </div>
            <div className={styles.serviceTitle}>Donate to causes</div>
            <Link to="/causelistpage" className={styles.serviceLink}>
              Donate <i className={styles.serviceLinkArrow}></i>
            </Link>
          </div>
          <div className={styles.serviceCard}>
            <div className={`${styles.serviceIconContainer} ${styles.serviceIcon3}`}>
              <img src={Section3Image3} alt="Give us your feedback" className={styles.serviceIcon} />
            </div>
            <div className={styles.serviceTitle}>Give us your feedback</div>
            <Link to="/profilesettings" className={styles.serviceLink}>
              Feedback <i className={styles.serviceLinkArrow}></i>
            </Link>
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
