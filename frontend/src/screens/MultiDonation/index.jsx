import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import apiService from '../../services/apiService';

const MultiDonation = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCart();
        setCart(data.cart);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await apiService.checkout(formData);
      if (response.authorization_url) {
        window.location.href = response.authorization_url;
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* Header content can be added later */}
      </header>
      <main className={styles.mainContent}>
        <div className={styles.linksRow}>
          <a href="#" onClick={() => navigate(-1)} className={styles.backText}>&larr; Back</a>
        </div>
        <h2 className={styles.donateNowText}>Donate Now</h2>
        <h3 className={styles.itemsOnCart}>Items on your cart</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="first_name">First name</label>
              <input id="first_name" name="first_name" type="text" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="last_name">Last name</label>
              <input id="last_name" name="last_name" type="text" value={formData.last_name} onChange={handleChange} required />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className={styles.donationSummary}>
            <h4>Donation Summary</h4>
            <ul>
              {cart && cart.items.map(item => (
                <li key={item.id}>
                  {item.cause?.title || 'Cause Title'} - GHS {item.donation_amount}
                </li>
              ))}
            </ul>
            <p>Total: GHS {cart ? cart.items.reduce((acc, item) => acc + item.donation_amount, 0) : 0}</p>
          </div>
          <button type="submit" className={styles.donateButton}>Proceed to Payment</button>
        </form>
      </main>
    </div>
  );
};

export default MultiDonation;
