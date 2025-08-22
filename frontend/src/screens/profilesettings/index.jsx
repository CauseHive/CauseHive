import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import apiService from '../../services/apiService';
import { useToast } from '../../components/Toast/ToastProvider';

const Profilesettings = () => {
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [picture, setPicture] = useState(null);
  const [cover, setCover] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = await apiService.getProfile();
        setBio(data.bio || '');
        setPhone(data.phone_number || '');
        setAddress(data.address || '');
      } catch (_) {}
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiService.updateProfile({ bio, phone_number: phone, address, profile_picture: picture, cover_photo: cover });
      toast.success('Profile updated');
    } catch (e) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar Section */}
      <aside className={styles.sidebar}>
        <div className={styles.menuIcon}>☰</div>
        <div className={styles.icon}>💙</div>
        <div className={styles.icon}>💬</div>
        <div className={styles.icon}>⏳</div>
        <div className={styles.icon}>📅</div>
        <div className={styles.icon}>👤</div>
        <div className={styles.icon}>⚙️</div>
        {/* Changed last icon from plug 🔌 to power button ⏻ */}
        <div className={styles.icon}>⏻</div>
      </aside>

      {/* Main Content Section */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Your Profile</span>
            <div className={styles.avatar}>🖤</div>
          </div>
        </header>

        {/* Settings Items */}
        <section className={styles.settingsSection}>
          <div className={styles.settingsItem}>
            <form onSubmit={onSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label>Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Phone number</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Profile picture</label>
                <input type="file" accept="image/*" onChange={(e) => setPicture(e.target.files?.[0] ?? null)} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Cover photo</label>
                <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />
                <div style={{ fontSize:12, color:'#6b7280' }}>If empty, a white placeholder will be shown.</div>
              </div>
              <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
            </form>
          </div>
          <div className={styles.settingsItem}>Notification Settings</div>
          <div className={styles.settingsItem}>Delete Account</div>
        </section>
      </main>
    </div>
  );
};

export default profilesettings;

