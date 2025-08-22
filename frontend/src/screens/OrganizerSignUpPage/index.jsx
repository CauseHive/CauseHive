import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Signup/styles.module.css';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import apiService from '../../services/apiService';

const OrganizerSignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await apiService.registerUser(formData);
            navigate('/sign-in');
        } catch (error) {
            setError(error.message);
        }
    };

  return (
    <div className={styles.signupPage}>
      <header className={styles.header}>
        {/* ... header ... */}
      </header>

      <main className={styles.mainContent}>
        <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>Back</button>
        <h1 className={styles.welcome}>
          Sign Up as an Organizer
        </h1>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.iconUser} />
            <input type="text" name="first_name" placeholder="First Name" className={styles.input} value={formData.first_name} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <FaUser className={styles.iconUser} />
            <input type="text" name="last_name" placeholder="Last Name" className={styles.input} value={formData.last_name} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.iconUser} />
            <input type="email" name="email" placeholder="Email" className={styles.input} value={formData.email} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <FaLock className={styles.iconLock} />
            <input type="password" name="password" placeholder="Password" className={styles.input} value={formData.password} onChange={handleChange} required />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.signInButton}>Sign Up</button>
        </form>
      </main>
    </div>
  );
};

export default OrganizerSignUpPage;
