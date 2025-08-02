import React from 'react';
import styles from './styles.module.css';
import BlogImage from './assets/section8_image.png';

const blogs = [
  {
    title: "How Azar become doctor",
    category: "Education",
    description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
  },
  {
    title: "Azar is fine now",
    category: "Education",
    description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
  },
  {
    title: "Donate Azar",
    category: "Education",
    description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
  },
];

const Section8 = () => {
  return (
    <section className={styles.section8Container}>
      <div className={styles.section8BlogLabel}>BLOGS</div>
      <h2 className={styles.section8MainHeading}>Look our latest articles</h2>
      <div className={styles.section8BlogCards}>
        {blogs.map((blog, index) => (
          <div key={index} className={styles.blogCard}>
            <img src={BlogImage} alt={blog.title} className={styles.blogImage} />
            <div className={styles.blogContent}>
              <div className={styles.blogCategory}>{blog.category}</div>
              <h3 className={styles.blogTitle}>{blog.title}</h3>
              <p className={styles.blogDescription}>{blog.description}</p>
              <a href="#" className={styles.blogLink}>
                Know more <span className={styles.arrow}>&rarr;</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section8;
