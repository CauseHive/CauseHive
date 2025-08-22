import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import apiService from '../../services/apiService';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    user: { first_name: '', last_name: '' },
    occupation: '',
    interests: '',
    phone_number: '',
    address: '',
    profile_picture: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await apiService.getUserProfile();
        setProfile(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      setProfile({ ...profile, profile_picture: files[0] });
    } else if (name.startsWith('user.')) {
      const userField = name.split('.')[1];
      setProfile({ ...profile, user: { ...profile.user, [userField]: value } });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    try {
      await apiService.updateUserProfile(profile);
      setSuccess(true);
      setTimeout(() => navigate('/profilepage'), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {/* Sidebar icons can be made functional later */}
        <div className={styles.menuIcon}>☰</div>
        <div className={styles.icon}>💙</div>
        <div className={styles.icon}>💬</div>
        <div className={styles.icon}>⏳</div>
        <div className={styles.icon}>📅</div>
        <div className={styles.icon}>👤</div>
        <div className={styles.icon}>⚙️</div>
        <div className={styles.icon}>🔌</div>
      </aside>
      <main className={styles.mainContent}>
        <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>Back</button>
        <header className={styles.header}>
          <h1 className={styles.title}>Profile Settings</h1>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{profile.user.first_name} {profile.user.last_name}</span>
            <div className={styles.avatar}>🖤</div>
          </div>
        </header>
        <section className={styles.settingsSection}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input type="text" name="user.first_name" value={profile.user.first_name} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input type="text" name="user.last_name" value={profile.user.last_name} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Occupation</label>
              <input type="text" name="occupation" value={profile.occupation} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Interests</label>
              <input type="text" name="interests" value={profile.interests} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input type="text" name="phone_number" value={profile.phone_number} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Address</label>
              <input type="text" name="address" value={profile.address} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Profile Picture</label>
              <input type="file" name="profile_picture" onChange={handleChange} />
            </div>
            <button type="submit" className={styles.submitButton}>Save Changes</button>
            {success && <p className={styles.successMessage}>Profile updated successfully!</p>}
          </form>
        </section>
      </main>
    </div>
  );
};

export default ProfileSettings;