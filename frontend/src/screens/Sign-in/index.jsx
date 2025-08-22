import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Signup/styles.module.css';
import { FaUser, FaLock } from 'react-icons/fa';
import apiService from '../../services/apiService';
import { useToast } from '../../components/Toast/ToastProvider';

const SignIn = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await apiService.loginUser({ email, password });
      if (data && data.access) {
        toast.success('Signed in successfully');
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Sign-in failed');
      toast.error('Sign-in failed');
    } finally {
      setSubmitting(false);
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
          <a href="/sign-in" className={styles.signIn}>Sign In</a>
          <a href="/signup" className={styles.signUpButton}>Sign Up</a>
        </div>
      </header>

      <main className={styles.mainContent}>
        <h1 className={styles.welcome}>
          Welcome back! <span role="img" aria-label="person waving">🧑‍🤝‍🧑</span>
        </h1>
        <p className={styles.subtext}>
          Glad to have you back
        </p>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.iconUser} />
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.iconLock} />
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <label className={styles.rememberMe}>
            <input type="checkbox" />
            Remember me
          </label>

          {error ? <div role="alert" style={{ marginTop: 8 }}>{error}</div> : null}

          <div className={styles.divider}>
            <hr />
            <span>OR</span>
            <hr />
          </div>
          <div className={styles.socialButtons}>
            {/* Social login buttons can be added here */}
          </div>

          <button type="submit" className={styles.signInButton} disabled={submitting}>{submitting ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </main>

      <div className={styles.backgroundCircle1}></div>
      <div className={styles.backgroundCircle2}></div>

       
    </div>
  );
};

export default SignIn;
