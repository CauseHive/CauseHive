import React, { useState } from 'react';
import styles from './styles.module.css';
import SidebarNav from '../../components/SidebarNav';

const Desktoppage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const favorites = [
    'Giving to homeless children at Labadi',
    'Giving to homeless children at Labadi',
    'Giving to homeless children at Labadi',
    'Giving to homeless children at Labadi',
    'Giving to homeless children at Labadi',
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.container}>
      <SidebarNav />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Your Favorites</h1>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search for Causes"
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <div className={styles.avatar}>🖤</div>
          </div>
        </header>
        <section className={styles.favoritesSection}>
          {favorites.map((favorite, index) => (
            <div key={index} className={styles.favoriteItem}>
              {favorite}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Desktoppage;