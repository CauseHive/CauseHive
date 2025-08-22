import React, { useState } from 'react';
import styles from './styles.module.css';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import googleLogo from '../../assets/google-logo.svg';
// facebookLogo import removed as it's not used
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { useToast } from '../../components/Toast/ToastProvider';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiService.registerUser({ first_name: firstName, last_name: lastName, email, password, password2 });
      toast.success('Account created');
      navigate('/sign-in');
    } catch (err) {
      setError('Sign up failed');
      toast.error('Sign up failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <header className={styles.header}>
        <div className={styles.logo}>CauseHive</div>
      </header>

      {/* Navigation bar removed as per request */}

      <main className={styles.mainContent}>
        <h1 className={styles.welcome}>
          Join the Movement, Lead the Change <span role="img" aria-label="person waving">🧑‍🤝‍🧑</span>
        </h1>
        <p className={styles.subtext}>
          Create your account to start empowering communities, rally supporters and make a lasting impact with CauseHive
        </p>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="First Name"
              className={styles.input}
              aria-label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Last Name"
              className={styles.input}
              aria-label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <div className={styles.iconUser}><FaUser /></div>
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
            <div className={styles.iconLock}><FaLock /></div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={styles.input}
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <div className={styles.eyeIcon} onClick={toggleShowPassword} style={{ cursor: 'pointer' }}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <div className={styles.iconLock}><FaLock /></div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={styles.input}
              aria-label="Confirm Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              autoComplete="new-password"
            />
            <div className={styles.eyeIcon} onClick={toggleShowConfirmPassword} style={{ cursor: 'pointer' }}>
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
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
            <a href="https://accounts.google.com/signin" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <img src={googleLogo} alt="Google logo" className={styles.socialIcon} />
              Continue with Google
            </a>
            <a href="https://www.facebook.com/login.php" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png" alt="Facebook logo" className={styles.socialIcon} />
              Continue with Facebook
            </a>
          </div>

          <button type="submit" className={styles.signInButton} disabled={submitting}>{submitting ? 'Signing up...' : 'Sign Up'}</button>
          <div className={styles.alreadyAccountLink} style={{ color: 'black' }}>
            <Link to="/sign-in" style={{ color: 'black' }}>Already have an account? Sign in</Link>
          </div>
        </form>
      </main>

      <div className={styles.backgroundCircle1}></div>
      <div className={styles.backgroundCircle2}></div>

      {/* Chatbot removed as per request */}
    </div>
  );
};

export default Signup;
