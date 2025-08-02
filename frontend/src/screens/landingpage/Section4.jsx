import React from 'react';
import styles from './styles.module.css';
import Section4Image1 from './assets/section4_image1.png';
import Section4Image2 from './assets/section4_image2.png';
import Section4Image3 from './assets/Section4_image3.png';
import Section4Image4 from './assets/section4_image4.png';

const Section4 = () => {
  return (
    <section className={styles.helpNeededSection}>
      <button className={styles.donateLabel}>DONATE</button>
      <h2 className={styles.helpNeededHeading}>Your help is Needed</h2>
      <div className={styles.helpCards}>
        <div className={styles.helpCard}>
          <img src={Section4Image1} alt="Help Azar" className={styles.helpCardImage} />
          <div className={styles.helpCardContent}>
            <span className={styles.categoryLabel} style={{backgroundColor: '#b6e3b6', color: '#3a7a3a'}}>Education</span>
            <h3 className={styles.helpCardTitle}>Help Azar to continue his study</h3>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: '60%', backgroundColor: '#8bc53f' }}></div>
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
          <img src={Section4Image2} alt="Save Peter" className={styles.helpCardImage} />
          <div className={styles.helpCardContent}>
            <span className={styles.categoryLabel} style={{backgroundColor: '#c7d7ff', color: '#3a4a9a'}}>Health</span>
            <h3 className={styles.helpCardTitle}>Save Peter life</h3>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: '80%', backgroundColor: '#8bc53f' }}></div>
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
          <img src={Section4Image3} alt="Build School" className={styles.helpCardImage} />
          <div className={styles.helpCardContent}>
            <span className={styles.categoryLabel} style={{backgroundColor: '#d7c7ff', color: '#3a3a9a'}}>School Construction</span>
            <h3 className={styles.helpCardTitle}>Build School for poor students</h3>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: '50%', backgroundColor: '#8bc53f' }}></div>
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
          <img src={Section4Image4} alt="Make them happy" className={styles.helpCardImage} />
          <div className={styles.helpCardContent}>
            <span className={styles.categoryLabel} style={{backgroundColor: '#b6d7ff', color: '#3a6a9a'}}>Education</span>
            <h3 className={styles.helpCardTitle}>Make them happy</h3>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: '70%', backgroundColor: '#8bc53f' }}></div>
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
      </div>
      <h2 className={styles.donateSupportHeading}>Donate to support Causes</h2>
    </section>
  );
};

export default Section4;
