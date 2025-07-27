import React, { useState } from 'react';
import { useSignIn } from './hooks';
import styles from '../Signup/styles.module.css';
import { FaUser, FaLock } from 'react-icons/fa';


const SignIn = () => {
  const { signInUser, loading, error } = useSignIn();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    try {
      await signInUser(formData);
      setSuccess('Sign in successful!');
    } catch (err) {
      // error is handled by hook
    }
  };

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

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.iconUser} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input}
              aria-label="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.iconLock} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={styles.input}
              aria-label="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

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

          <button type="submit" className={styles.signInButton} disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
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
