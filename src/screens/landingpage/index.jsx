import React from 'react';
import styles from './styles.module.css';
import NewHeroImage1 from './assets/New_Hero_Section_Image1.png';
import HeroImage2 from './assets/Hero_Section_Image2.png';
import Section3Image1 from './assets/Section_3_image1.png';
import Section3Image2 from './assets/Section_3_image2.png';
import Section3Image3 from './assets/Section_3_image3.png';
import Section5Image1 from './assets/section5_image1.png';
import Section5Image2 from './assets/Section5_image2.png';
import Section5Image3 from './assets/Section5_image3.png';
import Section5Image4 from './assets/Section5_image4.png';
import Section5Image5 from './assets/Section5_image5.png';
import Section6Image from './assets/section6_image.png';
import Section8Image from './assets/section8_image.png';

const LandingPage = () => {
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>CauseHive.</div>
        <div className={styles.navbarRight}>
          <div className={styles.navLink}>Home</div>
          <div className={styles.navLink}>
            Services
            <i className={styles.dropdownArrow}></i>
          </div>
          <div className={styles.navLink}>
            Join us
            <i className={styles.dropdownArrow}></i>
          </div>
          <div className={styles.navLink}>Contact us</div>
          <div className={styles.loginLink}>Log in</div>
          <button className={styles.donateButton}>Donate</button>
        </div>
      </nav>

      <section className={styles.heroSection}>
        <div className={styles.heroTextContainer}>
          <h1 className={styles.heroHeading}>
            Seeking Financial Aid for Medical Emergencies or Social Causes?
          </h1>
          <div className={styles.heroButtons}>
            <button className={styles.requestDonationButton}>REQUEST DONATION</button>
            <button className={styles.donateAndHelpButton}>DONATE AND HELP</button>
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

      {/* Removed the section between Section 2 and Section 3 as per user feedback */}

      <section className={styles.servicesSection}>
        <button className={styles.servicesLabel}>OUR SERVICES</button>
        {/* Removed the heading and other text around the button as per user request */}
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
      {/* Removed unwanted text elements that were overlapping the button */}
      {/* Removed unwanted text elements that were overlapping the button */}
      {/* Removed unwanted text elements that were overlapping the button */}

      <section className={styles.helpNeededSection}>
        <button className={styles.donateLabel}>DONATE</button>
        <h2 className={styles.helpNeededHeading}>Your help is Needed</h2>
        <div className={styles.helpCards}>
          <div className={styles.helpCard}>
            <img src={require('./assets/section4_image1.png')} alt="Help Azar" className={styles.helpCardImage} />
            <div className={styles.helpCardContent}>
              <span className={styles.categoryLabel}>Education</span>
              <h3 className={styles.helpCardTitle}>Help Azar to continue his study</h3>
              <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: '60%' }}></div>
              </div>
              <div className={styles.progressDetails}>
                <div>
              <div className={styles.progressLabel}>Goal</div>
              <div className={styles.progressValue}>₹1234</div>
            </div>
            <div>
              <div className={styles.progressLabel}>Collected</div>
              <div className={styles.progressValue}>₹1234</div>
            </div>
            <div>
              <div className={styles.progressLabel}>Remaining</div>
              <div className={styles.progressValue}>₹1234</div>
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

          <div className={styles.helpCard}>
            <img src={require('./assets/section4_image2.png')} alt="Save Peter" className={styles.helpCardImage} />
            <div className={styles.helpCardContent}>
              <span className={styles.categoryLabel}>Health</span>
              <h3 className={styles.helpCardTitle}>Save Peter life</h3>
              <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: '80%' }}></div>
              </div>
              <div className={styles.progressDetails}>
                <div>
                  <div className={styles.progressLabel}>Goal</div>
                  <div className={styles.progressValue}>₹1234</div>
                </div>
                <div>
                  <div className={styles.progressLabel}>Collected</div>
                  <div className={styles.progressValue}>₹1234</div>
                </div>
                <div>
                  <div className={styles.progressLabel}>Remaining</div>
                  <div className={styles.progressValue}>₹1234</div>
                </div>
              </div>
              <div className={styles.helpCardActions}>
                <button className={styles.donateButton}>
                  DONATE <span className={styles.heartIcon}>♥</span>
                </button>
                <button className={styles.forwardButton}>→</button>
              </div>
            </div>
          </div>

          <div className={styles.helpCard}>
            <img src={require('./assets/Section4_image3.png')} alt="Build School" className={styles.helpCardImage} />
            <div className={styles.helpCardContent}>
              <span className={styles.categoryLabel}>School Construction</span>
              <h3 className={styles.helpCardTitle}>Build School for poor students</h3>
              <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: '50%' }}></div>
              </div>
              <div className={styles.progressDetails}>
                <div>
                  <div className={styles.progressLabel}>Goal</div>
                  <div className={styles.progressValue}>₹1234</div>
                </div>
                <div>
                  <div className={styles.progressLabel}>Collected</div>
                  <div className={styles.progressValue}>₹1234</div>
                </div>
                <div>
                  <div className={styles.progressLabel}>Remaining</div>
                  <div className={styles.progressValue}>₹1234</div>
                </div>
              </div>
              <div className={styles.helpCardActions}>
                <button className={styles.donateButton}>
                  DONATE <span className={styles.heartIcon}>♥</span>
                </button>
                <button className={styles.forwardButton}>→</button>
              </div>
            </div>
          </div>

          <div className={styles.helpCard}>
            <img src={require('./assets/section4_image4.png')} alt="Make them happy" className={styles.helpCardImage} />
            <div className={styles.helpCardContent}>
              <span className={styles.categoryLabel}>Education</span>
              <h3 className={styles.helpCardTitle}>Make them happy</h3>
              <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: '70%' }}></div>
              </div>
              <div className={styles.progressDetails}>
                <div>
                  <div className={styles.progressLabel}>Goal</div>
                  <div className={styles.progressValue}>₹1234</div>
                </div>
                <div>
                  <div className={styles.progressLabel}>Collected</div>
                  <div className={styles.progressValue}>₹1234</div>
                </div>
                <div>
                  <div className={styles.progressLabel}>Remaining</div>
                  <div className={styles.progressValue}>₹1234</div>
                </div>
              </div>
              <div className={styles.helpCardActions}>
                <button className={styles.donateButton}>
                  DONATE <span className={styles.heartIcon}>♥</span>
                </button>
                <button className={styles.forwardButton}>→</button>
              </div>
            </div>
          </div>
        </div>
        <h2 className={styles.donateSupportHeading}>Donate to support Causes</h2>
          <div className={styles.navigationArrows}>
            <button className={styles.navArrow}></button>
            <button className={styles.navArrow}></button>
          </div>
        </section>

      {/* Section 5 */}
      <section className={styles.section5Container}>
        <div className={styles.successStoriesLabel}>SUCCESS STORIES</div>
        <div className={styles.section5TextBlock}>
          <h2 className={styles.section5MainHeading}>By you It’s happened</h2>
          <p className={styles.section5Description}>
            Lorem Ipsum is simply dummy text of the printin typesetting dummy text ever when an unknown printer took a galley of type and scrambled a type specimen book.
          </p>
        </div>
        <div className={styles.section5Grid}>
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
              <img src={Section5Image1} alt="Success story 3" className={styles.section5SmallImage} />
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
          <div className={styles.section5LargeImageContainer}>
            <img src={Section5Image3} alt="Success story 1" className={styles.section5LargeImage} />
            <div className={styles.imageOverlay}>
              {/* Moved Title and Subtext here as per user request */}
              {/* <div className={styles.imageTitle}>Title</div> */}
              {/* <div className={styles.imageSubtext}>Subtext</div> */}
              <a href="#" className={styles.knowMoreLink}>
                Know more <span className={styles.arrow}>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
        <h3 className={styles.section5CallToAction}>We want to support and hear more stories like these</h3>
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
      </section>

      {/* Section 6 */}
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

      {/* Section 7 */}
      <section className={styles.section7Container}>
        <div className={styles.testimonialsLabel}>TESTIMONIALS</div>
        <h2 className={styles.section7Heading}>What people says about us</h2>
        <div className={styles.testimonialBox}>
          <div className={styles.quoteIcon}>&ldquo;&rdquo;</div>
          <p className={styles.testimonialText}>
            contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC
          </p>
          <div className={styles.testimonialAuthor}>Syed</div>
          <div className={styles.paginationDots}>
            <span className={styles.activeDot}></span>
            <span className={styles.inactiveDot}></span>
            <span className={styles.inactiveDot}></span>
          </div>
        </div>
        <div className={styles.statisticsContainer}>
          <div className={styles.statisticItem}>
            <div className={styles.statisticNumber}>0%</div>
            <div className={styles.statisticLabel}>Platform charge</div>
            <div className={styles.statisticDescription}>
              contrary to popular belief, Lorem Ipsum is not simply random text.
            </div>
          </div>
          <div className={styles.statisticItem}>
            <div className={styles.statisticNumber}>12+ Lakh</div>
            <div className={styles.statisticLabel}>Donations given</div>
            <div className={styles.statisticDescription}>
              contrary to popular belief, Lorem Ipsum is not simply random text.
            </div>
          </div>
          <div className={styles.statisticItem}>
            <div className={styles.statisticNumber}>16+ Lakh</div>
            <div className={styles.statisticLabel}>Active Donors</div>
            <div className={styles.statisticDescription}>
              contrary to popular belief, Lorem Ipsum is not simply random text.
            </div>
          </div>
          <div className={styles.statisticItem}>
            <div className={styles.statisticNumber}>2000+</div>
            <div className={styles.statisticLabel}>Success stories</div>
            <div className={styles.statisticDescription}>
              contrary to popular belief, Lorem Ipsum is not simply random text.
            </div>
          </div>
        </div>
      </section>

      {/* Section 8 */}
      <section className={styles.section8Container}>
        <div className={styles.blogsLabel}>BLOGS</div>
        <h2 className={styles.section8Heading}>Look our latest articles</h2>
        <div className={styles.blogCardsContainer}>
          <div className={styles.blogCard}>
            <img src={Section8Image} alt="Blog 1" className={styles.blogImage} />
            <div className={styles.blogContent}>
              <div className={styles.blogCategory}>Education</div>
              <h3 className={styles.blogTitle}>How Azar become doctor</h3>
              <p className={styles.blogDescription}>
                contrary to popular belief, Lorem Ipsum is not simply random text.
              </p>
              <a href="#" className={styles.knowMoreLink}>
                Know more <span className={styles.arrow}>&rarr;</span>
              </a>
            </div>
          </div>
          <div className={styles.blogCard}>
            <img src={Section8Image} alt="Blog 2" className={styles.blogImage} />
            <div className={styles.blogContent}>
              <div className={styles.blogCategory}>Education</div>
              <h3 className={styles.blogTitle}>Azar is fine now</h3>
              <p className={styles.blogDescription}>
                contrary to popular belief, Lorem Ipsum is not simply random text.
              </p>
              <a href="#" className={styles.knowMoreLink}>
                Know more <span className={styles.arrow}>&rarr;</span>
              </a>
            </div>
          </div>
          <div className={styles.blogCard}>
            <img src={Section8Image} alt="Blog 3" className={styles.blogImage} />
            <div className={styles.blogContent}>
              <div className={styles.blogCategory}>Education</div>
              <h3 className={styles.blogTitle}>Donate Azar</h3>
              <p className={styles.blogDescription}>
                contrary to popular belief, Lorem Ipsum is not simply random text.
              </p>
              <a href="#" className={styles.knowMoreLink}>
                Know more <span className={styles.arrow}>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
