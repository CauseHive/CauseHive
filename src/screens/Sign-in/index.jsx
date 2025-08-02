import React from 'react';
import styles from '../Signup/styles.module.css';
import { FaUser, FaLock } from 'react-icons/fa';

const SignIn = () => {
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
          <a href="/signin" className={styles.signIn}>Sign In</a>
          <div className={styles.signUpButton}>
            <>
              Sign Up
              <div className={styles.dropdown}>
                <a href="/signup/attendee" className={styles.dropdownItem}>Attendee</a>
                <a href="/signup/organiser" className={styles.dropdownItemActive}>Organizer</a>
              </div>
            </>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <h1 className={styles.welcome}>
          Join the Movement, Lead the Change <span role="img" aria-label="person waving">🧑‍🤝‍🧑</span>
        </h1>
        <p className={styles.subtext}>
          Create your account to start empowering communities, rally supporters and make a lasting impact with CauseHive
        </p>

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

          <button type="submit" className={styles.signInButton}>Sign In</button>
        </form>
      </main>

      <div className={styles.backgroundCircle1}></div>
      <div className={styles.backgroundCircle2}></div>

      <div className={styles.chatBubble}>
        Hi I’m Hive<br />Need help with anything?
      </div>
      <div className={styles.chatIcon}></div>
    </div>
  );
};

export default SignIn;
