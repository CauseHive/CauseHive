import React, { useState } from 'react';
import styles from './styles.module.css';

const countryCodes = [
  { code: 'GH', dialCode: '+233' },
  { code: 'US', dialCode: '+1' },
  { code: 'GB', dialCode: '+44' },
  { code: 'CA', dialCode: '+1' },
  { code: 'AU', dialCode: '+61' },
  // Add more countries as needed
];

const Donation = () => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);

  const handleCountryChange = (e) => {
    const country = countryCodes.find(c => c.code === e.target.value);
    if (country) {
      setSelectedCountry(country);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <input
          type="text"
          placeholder="Search for Causes"
          className={styles.searchInput}
        />
        <div className={styles.cartIconWrapper}>
          <svg
            width="24"
            height="24"
            fill="#2f3e46"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm-12.83-2l1.72-7h11.22l1.72 7h-14.66zm15.83-9h-16l-1-4h-2v2h1l3.6 7.59-1.35 2.44c-.16.28-.25.61-.25.97 0 1.104.896 2 2 2h12v-2h-11.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49-1.74-1z" />
          </svg>
          <span className={styles.cartBadge}>2</span>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.linksRow}>
          <span className={styles.donateNowText}>Donate Now</span>
          <span
            className={styles.backText}
            onClick={() => window.location.href = '/causelistpage'}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.location.href = '/causelistpage';
              }
            }}
          >
            ← Back
          </span>
        </div>
        <h1 className={styles.title}>
          SpringLife Donation campaign: Seeking to restore humanity.
        </h1>

        <form className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName">First name</label>
              <input type="text" id="firstName" placeholder="" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Last name</label>
              <input type="text" id="lastName" placeholder="" />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" placeholder="" />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                className={styles.countryInput}
              />
            </div>

            <div className={styles.verticalSeparator}></div>

            <div className={styles.inputGroupPhone}>
              <label htmlFor="phoneNumber">Phone number</label>
              <div className={styles.phoneInputWrapper}>
                <select
                  id="phoneCountryCode"
                  className={styles.countryCodeInput}
                  defaultValue="GH"
                  aria-label="Select country code"
                  onChange={handleCountryChange}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code}
                    </option>
                  ))}
                </select>
                <div className={styles.upDownTab}></div>
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="+233"
                  className={styles.phoneNumberInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="donationAmount">Donation amount</label>
            <input type="text" id="donationAmount" placeholder="¢" />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="paymentMethod">Payment method</label>
            <input type="text" id="paymentMethod" placeholder="" />
          </div>

          <div className={styles.checkboxGroup}>
            <input type="checkbox" id="donateAnonymously" />
            <label htmlFor="donateAnonymously">Donate anonymously</label>
          </div>

          <button type="submit" className={styles.donateButton}>
            Donate
          </button>
        </form>
      </main>
    </div>
  );
};

export default Donation;
