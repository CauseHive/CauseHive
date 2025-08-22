import React from 'react';
import styles from '../Signup/styles.module.css';
import { FaUser, FaLock } from 'react-icons/fa';

const OrganizerSignUpPage = () => {
  return (
    <div className={styles.signupPage}>
      <header className={styles.header}>
        <div className={styles.logo}>CauseHive</div>
        <input
          type="search"
          placeholder="Search for events"
          className={styles.searchBar}
          aria-label="Search for events"
        />
        <div className={styles.authButtons}>
          <a href="/sign-in" className={styles.signIn}>Sign In</a>
          <a href="/signup" className={styles.signUpButton}>Sign Up</a>
        </div>
      </header>

      <main className={styles.mainContent}>
        <h1 className={styles.welcome}>
          Sign into Your Administrator account <span role="img" aria-label="person waving">🧑‍🤝‍🧑</span>
        </h1>
        

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.iconUser} />
            <input
              type="text"
              placeholder="Email/Username/Contact"
              className={styles.input}
              aria-label="Email, Username or Contact"
            />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.iconLock} />
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              aria-label="Password"
            />
          </div>

          <label className={styles.rememberMe}>
            <input type="checkbox" />
            Remember me
          </label>

          <div className={styles.divider}>
            <hr />
            <span>OR</span>
            <hr />
          </div>
          <div className={styles.socialButtons}>
            {/* Social login buttons can be added here */}
          </div>

          <button type="submit" className={styles.signInButton}>Sign in</button>
        </form>
      </main>

      <div className={styles.backgroundCircle1}></div>
      <div className={styles.backgroundCircle2}></div>

       
    </div>
  );
};

export default OrganizerSignUpPage;
