import React, { useState } from 'react';
import styles from './styles.module.css';

const testimonials = [
  {
    text: "contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC",
    author: "Syed",
  },
  {
    text: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    author: "Alex",
  },
  {
    text: "It has survived not only five centuries, but also the leap into electronic typesetting.",
    author: "Maria",
  },
];

const stats = [
  {
    value: "0%",
    title: "Platform charge",
    description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
  },
  {
    value: "12k+ GHC",
    title: "Donations given",
    description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
  },
  {
    value: "16k+ ",
    title: "Active Donors",
    description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
  },
  {
    value: "20K+",
    title: "Success stories",
    description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
  },
];

const Section7 = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleDotClick = (index) => {
    setCurrentTestimonial(index);
  };

  return (
    <section className={styles.section7Container}>
      <button className={styles.section7TestimonialLabel}>TESTIMONIALS</button>
      <h2 className={styles.section7MainHeading}>What people says about us</h2>
      <div className={styles.section7TestimonialBox}>
        <div className={styles.quoteMark}>&ldquo;&rdquo;</div>
        <p className={styles.testimonialText}>{testimonials[currentTestimonial].text}</p>
        <div className={styles.testimonialAuthor}>{testimonials[currentTestimonial].author}</div>
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
      <div className={styles.section7Stats}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statTitle}>{stat.title}</div>
            <div className={styles.statDescription}>{stat.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section7;
