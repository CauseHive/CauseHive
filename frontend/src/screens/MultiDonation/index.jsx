import React, { useState } from 'react';
import styles from './styles.module.css';

const CartIcon = () => (
  <svg width="24" height="24" fill="#2f3e46" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm-12.83-2l1.72-7h11.22l1.72 7h-14.66zm15.83-9h-16l-1-4h-2v2h1l3.6 7.59-1.35 2.44c-.16.28-.25.61-.25.97 0 1.104.896 2 2 2h12v-2h-11.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49-1.74-1z"/>
  </svg>
);

const MultiDonation = () => {
  const donationIndex = 0; // Removed unused setDonationIndex
  const donationLabels = ['Donation 1', 'Donation 2', 'Donation 3'];

  // Removed unused countryCodeMap

  const [selectedCountry, setSelectedCountry] = useState('GHANA');
  // Removed unused phoneCode state

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    // Removed setPhoneCode (was unused)
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <input type="text" placeholder="Search for Causes" className={styles.searchInput} />
        <div className={styles.cartIconWrapper}>
          <CartIcon />
          <span className={styles.cartBadge}>2</span>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.mainContent}>
        <div className={styles.linksRow}>
            <button type="button" className={styles.backText} onClick={() => window.history.back()}>&larr; Back</button>
        </div>

        <h2 className={styles.donateNowText}>Donate Now</h2>
        <h3 className={styles.itemsOnCart}>Items on your cart</h3>

        <form className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName">First name</label>
              <input id="firstName" type="text" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Last name</label>
              <input id="lastName" type="text" />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="country">Country</label>
              <input id="country" type="text" />
            </div>
            <div className={styles.inputGroupPhone}>
              <label>Phone number</label>
              <div className={styles.phoneInputWrapper}>
                <select
                  className={styles.countryCodeInput}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                >
                  <option value="GHANA">GH</option>
                  <option value="NIGERIA">Ni</option>
                  <option value="SOUTH AFRICA">SA</option>
                  <option value="UK">UK</option>
                  <option value="USA">US</option>
                </select>
                <input className={styles.phoneNumberInput} type="text" />
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="donateHow">Choose how you want to donate</label>
            <select id="donateHow" defaultValue="Separately">
              <option value="Separately">Separately</option>
              <option value="Together">Together</option>
            </select>
          </div>

          <div className={styles.donationRow}>
            <div className={styles.donationGroup}>
              <label>{donationLabels[donationIndex]}</label>
              <input type="text" />
            </div>
            <div className={styles.donationGroup}>
              <label>{donationLabels[(donationIndex + 1) % donationLabels.length]}</label>
              <input type="text" />
            </div>
            <div className={styles.donationGroup}>
              <label>{donationLabels[(donationIndex + 2) % donationLabels.length]}</label>
              <input type="text" />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="paymentMethod">Payment method</label>
            <input id="paymentMethod" type="text" />
          </div>

          <div className={styles.checkboxGroup}>
            <input id="donateAnonymously" type="checkbox" />
            <label htmlFor="donateAnonymously">Donate anonymously</label>
          </div>

          <button type="submit" className={styles.donateBtn}>Donate</button>
        </form>
      </main>
    </div>
  );
};

export default MultiDonation;
