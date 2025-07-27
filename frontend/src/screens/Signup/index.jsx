import React, { useState } from 'react';
import { registerUser } from './api';
import styles from './styles.module.css';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import googleLogo from '../../assets/google-logo.svg';
import facebookLogo from '../../assets/facebook-logo.svg';
import { Link } from 'react-router-dom';


const Signup = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (formData.password !== formData.confirmPassword) {
      setError({ message: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    try {
      await registerUser({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      setSuccess('Signup successful! You can now sign in.');
      setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className={styles.signupPage}>

      <header className={styles.header}>
        <div className={styles.logo}>CauseHive</div>
        
        
      </header>

      {/* Navigation bar removed as per request */}

      <main className={styles.mainContent}>
        <h1 className={styles.welcome}>
          Join CauseHive <span role="img" aria-label="person waving">🧑‍🤝‍🧑</span>
        </h1>
        <p className={styles.subtext}>
          Sign up to connect, support causes, and make a difference with CauseHive. Everyone is welcome!
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className={styles.input}
              aria-label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className={styles.input}
              aria-label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <div className={styles.iconUser}><FaUser /></div>
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
            <div className={styles.iconLock}><FaLock /></div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className={styles.input}
              aria-label="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className={styles.eyeIcon} onClick={toggleShowPassword} style={{ cursor: 'pointer' }}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <div className={styles.iconLock}><FaLock /></div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className={styles.input}
              aria-label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <div className={styles.eyeIcon} onClick={toggleShowConfirmPassword} style={{ cursor: 'pointer' }}>
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

          {error && <div className={styles.error}>{error.message || 'Signup failed'}</div>}
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
            <a href="https://accounts.google.com/signin" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <img src={googleLogo} alt="Google logo" className={styles.socialIcon} />
              Continue with Google
            </a>
            <a href="https://www.facebook.com/login.php" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png" alt="Facebook logo" className={styles.socialIcon} />
              Continue with Facebook
            </a>
          </div>

          <button type="submit" className={styles.signInButton} disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
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
