import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import PaulStatamImage from '../../assets/PaulStatamImage.png';
import Causelist_image1 from '../../assets/Causelist_image1.png';
import Causelist_image2 from '../../assets/Causelist_image2.png';
import apiService from '../../services/apiService';

const CauseListpage = () => {
  const navigate = useNavigate();
  const [timeFrame, setTimeFrame] = useState('One week');
  const [cartCount, setCartCount] = useState(2);
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        setLoading(true);
        const data = await apiService.getNewCauses();
        setCauses(data.results || []);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCauses();
  }, []);

  const handleIconClick = (item) => {
    console.log(`${item} clicked`);
  };

  const handleAddToCart = (id) => {
    console.log(`Added to cart: ${id}`);
    setCartCount(cartCount + 1);
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <a href="#" onClick={() => handleIconClick('Menu')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <rect y="6" width="24" height="2" rx="1" />
            <rect y="11" width="24" height="2" rx="1" />
            <rect y="16" width="24" height="2" rx="1" />
          </svg>
        </a>
        <a href="#" onClick={() => handleIconClick('UI Elements')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M3 13h8v8H3zm0-10h8v8H3zm10 0h8v8h-8zm0 10h8v8h-8z" />
          </svg>
        </a>
        <a href="#" onClick={() => handleIconClick('Favorites')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </a>
        <a href="#" onClick={() => handleIconClick('File Manager')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
          </svg>
        </a>
        <a href="#" onClick={() => handleIconClick('Calender')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V8h14v12z" />
          </svg>
        </a>
        <a href="#" onClick={() => handleIconClick('Profile')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
        </a>
        <a href="#" onClick={() => handleIconClick('Settings')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.47-.12-.61l-2.03-1.58zm-5.14 1.06c-1.6 0-2.9-1.3-2.9-2.9s1.3-2.9 2.9-2.9 2.9 1.3 2.9 2.9-1.3 2.9-2.9 2.9z" />
          </svg>
        </a>
        <a href="#" onClick={() => handleIconClick('Logout')} className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
        </a>
      </aside>
      <main className={styles.main}>
        <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>Back</button>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Causes</h1>
            <div className={styles.filter}>
              <input type="text" placeholder="Filter by" className={styles.filterInput} />
              <svg width="10" height="6" viewBox="0 0 10 6" fill="#666" className={styles.dropdownIcon}>
                <path d="M0 0l5 6 5-6z" />
              </svg>
              <div className={styles.dropdown}>
                <div>Date created</div>
                <div>Popularity</div>
                <div>Created by</div>
                <div>Category</div>
                <div>Goal amount</div>
              </div>
            </div>
          </div>
          <div className={styles.headerControls}>
            <Link to="#">
              <div className={styles.cart}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#666" className={styles.cartIcon}>
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-0.16 0.28-0.25 0.61-0.25 0.96 0 1.1 0.9 2 2 2h10v-2H7.42c-0.14 0-0.25-0.11-0.25-0.25l0.03-0.12 0.9-1.63h7.45c0.75 0 1.41-0.41 1.75-1.03l3.58-6.49c0.08-0.14 0.12-0.31 0.12-0.48 0-0.41-0.33-0.75-0.75-0.75H5.21l-0.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s0.89 2 1.99 2 2-0.9 2-2-0.9-2-2-2z" />
                </svg>
                <span className={styles.cartCount}>{cartCount}</span>
              </div>
            </Link>
            <Link to="/profilepage">
              <img src={PaulStatamImage} alt="Profile" className={styles.profileIcon} />
            </Link>
          </div>
        </header>
        <div className={styles.content}>
          {loading && <p>Loading causes...</p>}
          {error && <p>Error fetching causes: {error}</p>}
          {!loading && !error && (
            <div className={styles.causeGrid}>
              <div className={styles.leftColumn}>
                {causes.slice(0, Math.ceil(causes.length / 2)).map((cause) => (
                  <Link to={`/causedetailpage/${cause.id}`} key={cause.id} className={styles.causeCardLink}>
                    <div className={styles.causeCard}>
                      <img src={cause.image || Causelist_image1} alt={cause.title} className={styles.causeImage} />
                      <button className={styles.addToCartButton} onClick={(e) => { e.preventDefault(); handleAddToCart(cause.id); }}>
                        Add to cart
                      </button>
                      <div className={styles.causeDetails}>
                        <h3 className={styles.causeTitle}>{cause.title}</h3>
                        <p className={styles.causeDescription}>{cause.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className={styles.rightColumn}>
                {causes.slice(Math.ceil(causes.length / 2)).map((cause) => (
                  <Link to={`/causedetailpage/${cause.id}`} key={cause.id} className={styles.causeCardLink}>
                    <div className={styles.causeCard}>
                      <img src={cause.image || Causelist_image2} alt={cause.title} className={styles.causeImage} />
                      <button className={styles.addToCartButton} onClick={(e) => { e.preventDefault(); handleAddToCart(cause.id); }}>
                        Add to cart
                      </button>
                      <div className={styles.causeDetails}>
                        <h3 className={styles.causeTitle}>{cause.title}</h3>
                        <p className={styles.causeDescription}>{cause.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CauseListpage;