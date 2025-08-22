import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import BlogImage from './assets/section8_image.png';
import apiService from '../../services/apiService';

const Section8 = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await apiService.getBlogPosts();
        const fetchedBlogs = data.results || data;
        
        setBlogs(fetchedBlogs.length > 0 ? fetchedBlogs : [
          {
            id: 1,
            title: "How Azar become doctor",
            category: "Education",
            image: BlogImage,
            slug: "how-azar-become-doctor"
          },
          {
            id: 2,
            title: "Azar is fine now",
            category: "Education", 
            image: BlogImage,
            slug: "azar-is-fine-now"
          },
          {
            id: 3,
            title: "Donate Azar",
            category: "Education",
            image: BlogImage,
            slug: "donate-azar"
          },
        ]);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Fallback to default blogs
        setBlogs([
          {
            id: 1,
            title: "How Azar become doctor",
            category: "Education",
            image: BlogImage,
            slug: "how-azar-become-doctor"
          },
          {
            id: 2,
            title: "Azar is fine now",
            category: "Education",
            image: BlogImage,
            slug: "azar-is-fine-now"
          },
          {
            id: 3,
            title: "Donate Azar",
            category: "Education",
            image: BlogImage,
            slug: "donate-azar"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleBlogClick = (blog) => {
    // Navigate to blog detail page or external URL
    if (blog.url) {
      window.open(blog.url, '_blank');
    } else if (blog.slug) {
      window.open(`/blog/${blog.slug}`, '_blank');
    } else {
      window.open(`/blog/${blog.id}`, '_blank');
    }
  };
  return (
    <section className={styles.section8Container}>
      <div className={styles.section8BlogLabel}>BLOGS</div>
      <h2 className={styles.section8MainHeading}>Look our latest articles</h2>
      {loading ? (
        <div className={styles.loadingMessage}>Loading articles...</div>
      ) : (
        <div className={styles.section8BlogCards}>
          {blogs.map((blog) => (
            <div key={blog.id || blog.title} className={styles.blogCard}>
              <img 
                src={blog.image || blog.featured_image || BlogImage} 
                alt={blog.title} 
                className={styles.blogImage} 
              />
              <div className={styles.blogContent}>
                <div className={styles.blogCategory}>
                  {blog.category || blog.category_name || 'General'}
                </div>
                <h3 className={styles.blogTitle}>
                  {blog.title}
                </h3>
                <p className={styles.blogDescription}>
                  {blog.description || blog.excerpt || blog.content?.substring(0, 100) + '...' || ''}
                </p>
                <button 
                  onClick={() => handleBlogClick(blog)} 
                  className={styles.blogLink}
                >
                  Know more <span className={styles.arrow}>&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Section8;
