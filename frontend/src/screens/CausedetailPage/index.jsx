import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../../services/apiService';
import styles from './styles.module.css';

// --- Hardcoded Icons (as in the original file) ---
const HamburgerIcon = () => (
    <svg width="24" height="24" fill="#8b8b8b" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <rect y="4" width="24" height="2" rx="1" />
      <rect y="11" width="24" height="2" rx="1" />
      <rect y="18" width="24" height="2" rx="1" />
    </svg>
  );

  const GridIcon = ({ active }) => (
    <svg width="24" height="24" fill={active ? '#2f3e46' : '#b0b0b0'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );

  const HeartIcon = ({ active }) => (
    <svg width="24" height="24" fill={active ? '#2f3e46' : '#b0b0b0'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 21s-1-.45-2.1-1.35C7.4 17.9 4 15.36 4 11.5 4 8.42 6.42 6 9.5 6c1.54 0 3.04.99 3.5 2.44C13.46 6.99 14.96 6 16.5 6 19.58 6 22 8.42 22 11.5c0 3.86-3.4 6.4-5.9 8.15C13 20.55 12 21 12 21z" />
    </svg>
  );

  const ChatIcon = ({ active }) => (
    <svg width="24" height="24" fill={active ? '#2f3e46' : '#b0b0b0'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M4 4h16v12H5.17L4 17.17V4z" />
    </svg>
  );

  const BooksIcon = ({ active }) => (
    <svg width="24" height="24" fill={active ? '#2f3e46' : '#b0b0b0'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="3" y1="14" x2="21" y2="14" />
    </svg>
  );

  const LayersIcon = ({ active }) => (
    <svg width="24" height="24" fill={active ? '#2f3e46' : '#b0b0b0'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" />
    </svg>
  );

  const CalendarIcon = ({ active }) => (
    <svg width="24" height="24" fill={active ? '#2f3e46' : '#b0b0b0'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const UserIcon = ({ active }) => (
    <svg width="24" height="24" fill={active ? '#2f3e46' : '#b0b0b0'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0113 0" />
    </svg>
  );

  const GearIcon = ({ active }) => (
    <svg width="24" height="24" fill={active ? '#2f3e46' : '#b0b0b0'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );

  const PowerIcon = ({ active }) => (
    <svg width="24" height="24" fill={active ? '#2f3e46' : '#b0b0b0'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2v10" />
      <circle cx="12" cy="17" r="5" />
    </svg>
  );

  const CartIcon = () => (
    <svg width="24" height="24" fill="#2f3e46" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm-12.83-2l1.72-7h11.22l1.72 7h-14.66zm15.83-9h-16l-1-4h-2v2h1l3.6 7.59-1.35 2.44c-.16.28-.25.61-.25.97 0 1.104.896 2 2 2h12v-2h-11.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49-1.74-1z"/>
    </svg>
  );


const CausedetailPage = () => {
  const { causeId } = useParams();
  const [cause, setCause] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCauseDetails = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCauseById(causeId);
        setCause(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch cause details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCauseDetails();
  }, [causeId]);

  const handleAddToCart = async () => {
    try {
      await apiService.addToCart({ cause_id: cause.id, amount: 50 }); // Example amount
      alert('Added to cart!');
    } catch (err) {
      alert('Failed to add to cart.');
    }
  };

  if (loading) return <p>Loading cause details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!cause) return <p>Cause not found.</p>;

  const progressPercentage = (cause.donated_amount / cause.goal_amount) * 100;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <a href="#" className={styles.sidebarIcon}><HamburgerIcon /></a>
          <a href="#" className={styles.sidebarIcon}><GridIcon /></a>
          <a href="#" className={styles.sidebarIcon}><HeartIcon /></a>
          <a href="#" className={styles.sidebarIcon}><ChatIcon /></a>
          <a href="#" className={styles.sidebarIcon}><BooksIcon /></a>
          <a href="#" className={styles.sidebarIcon}><LayersIcon /></a>
          <a href="#" className={styles.sidebarIcon}><CalendarIcon /></a>
        </div>
        <div className={styles.sidebarBottom}>
          <a href="#" className={styles.sidebarIcon}><UserIcon /></a>
          <a href="#" className={styles.sidebarIcon}><GearIcon /></a>
          <a href="#" className={styles.sidebarIcon}><PowerIcon /></a>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
        <Link to="/" className={styles.logo}><strong>CauseHive.</strong></Link>
          <input type="text" placeholder="Search" className={styles.searchInput} />
          <Link to="/cartpage" className={styles.cartIconWrapper}>
            <CartIcon />
            {/* You might want to fetch cart item count here */}
            <span className={styles.cartBadge}>!</span>
          </Link>
        </header>

        <h2 className={styles.detailsTitle}>Details</h2>
        <h3 className={styles.causeTitle}>{cause.title}</h3>

        <div className={styles.largeContentBox}>
            <img src={cause.image_url || 'https://via.placeholder.com/600x300'} alt={cause.title} className={styles.mainImage} />
        </div>

        <div className={styles.smallBoxesContainer}>
            {/* Placeholder for additional images if available */}
            <div className={styles.smallBox}></div>
            <div className={styles.smallBox}></div>
            <div className={styles.smallBox}></div>
        </div>

        <div className={styles.bottomInfoContainer}>
          <div className={styles.leftInfo}>
            <p><strong>Created by:</strong> {cause.created_by || 'Anonymous'}</p>
            <p><strong>Description:</strong></p>
            <p>{cause.description}</p>
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p><strong>Progress: {progressPercentage.toFixed(2)}% reached</strong></p>
            <p>(${cause.donated_amount} / ${cause.goal_amount})</p>
            <p><strong>Category:</strong></p>
            <p>{cause.category || 'Uncategorized'}</p>
          </div>
        </div>

        <div className={styles.buttonsContainer}>
          <Link to={`/donation?cause_id=${cause.id}`} className={styles.donateButton}>Donate</Link>
          <button onClick={handleAddToCart} className={styles.addToCartButton}>Add to Cart</button>
        </div>
      </main>
    </div>
  );
};

export default CausedetailPage;
