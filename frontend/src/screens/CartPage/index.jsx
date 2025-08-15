import React, { useState } from 'react';
import styles from './styles.module.css';

import { useNavigate } from 'react-router-dom';

// Sidebar icons omitted for brevity (assumed already implemented)

const CartIcon = () => (
  <svg width="24" height="24" fill="#2f3e46" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm-12.83-2l1.72-7h11.22l1.72 7h-14.66zm15.83-9h-16l-1-4h-2v2h1l3.6 7.59-1.35 2.44c-.16.28-.25.61-.25.97 0 1.104.896 2 2 2h12v-2h-11.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49-1.74-1z"/>
  </svg>
);

const CartItem = ({ selected, onSelect }) => {
  return (
    <div className={styles.cartItem}>
      <div
        className={selected ? styles.checkboxSelected : styles.checkbox}
        onClick={onSelect}
        role="checkbox"
        aria-checked={selected}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
      />
      <div className={styles.cartItemInfo}>
        <span>Help Agnes go to school</span>
        <span>Goal: GHS3000</span>
        <span>Created by: Janet Ofori</span>
      </div>
      <div className={styles.priceBox}>
        <span>GHS 0</span>
        <button className={styles.dropdownButton} aria-label="Price dropdown">&#9660;</button>
      </div>
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([true, true, false, false, false, false]);

  const handleLogout = () => {
    navigate('/sign-in');
  };

  const toggleSelect = (index) => {
    const newSelected = [...selectedItems];
    newSelected[index] = !newSelected[index];
    setSelectedItems(newSelected);
  };

  const selectedCount = selectedItems.filter(Boolean).length;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        {/* Sidebar buttons with icons and logout handler */}
        {/* ... (assumed implemented as before) */}
      </aside>

      {/* Main content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.logo}>CauseHive.</h1>
          <h2 className={styles.title}>Your Cart</h2>
          <input type="text" placeholder="Search" className={styles.searchInput} />
          <div className={styles.userAvatar}>
            <img src="/path/to/avatar.png" alt="User Avatar" />
            <button className={styles.dropdownButton} aria-label="User menu">&#9660;</button>
          </div>
        </header>

        <section className={styles.filters}>
          <div className={styles.filterInputWrapper}>
            <input type="text" placeholder="filter by" className={styles.filterInput} />
            <button className={styles.dropdownButton} aria-label="Filter dropdown">&#9660;</button>
          </div>
          <div className={styles.filterInputWrapper}>
            <input type="text" className={styles.filterInput} />
            <button className={styles.dropdownButtonAlt} aria-label="Filter dropdown">&#9660;</button>
          </div>
        </section>

        <section className={styles.cartList}>
          {selectedItems.map((selected, i) => (
            <CartItem key={i} selected={selected} onSelect={() => toggleSelect(i)} />
          ))}
        </section>

        <footer className={styles.footer}>
          <span>{selectedCount} selected</span>
          <button className={styles.checkoutButton}>Checkout</button>
        </footer>
      </main>
    </div>
  );
};

export default CartPage;
