import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import apiService from '../../services/apiService';

const Donation = () => {
  const { causeId } = useParams();
  const navigate = useNavigate();
  const [cause, setCause] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    amount: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCause = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCauseById(causeId);
        setCause(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    if (causeId) {
      fetchCause();
    }
  }, [causeId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
        const paymentData = {
            cause_id: causeId,
            donation_amount: formData.amount,
            email: formData.email,
        };
        const response = await apiService.initiatePayment(paymentData);
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
          <span className={styles.donateNowText}>Donate Now</span>
          <span className={styles.backText} onClick={() => navigate(-1)} role="link">
            ← Back
          </span>
        </div>
        <h1 className={styles.title}>{cause?.title}</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="first_name">First name</label>
              <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="last_name">Last name</label>
              <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="amount">Donation amount</label>
            <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} placeholder="GHS" required />
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
