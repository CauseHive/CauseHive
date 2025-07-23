// signup/index.jsx
import React, { useState } from 'react';
import styles from './styles.module.css';
import { useSignup } from './hooks';
import styles from './styles.module.css';
import { Link } from 'react-router-dom';


const Signup = () => {
  const { signup, loading, error } = useSignup();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup(formData);
    if (result) {
      alert('Signup successful!');
      // Optionally redirect to login or dashboard
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        {error && <p className={styles.error}>{error.message || 'Signup failed'}</p>}
      </form>
    </div>
  );
};

export default Signup;
