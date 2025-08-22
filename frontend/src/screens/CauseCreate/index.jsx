import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import apiService from '../../services/apiService';
import SidebarNav from '../../components/SidebarNav';
import { useToast } from '../../components/Toast/ToastProvider';

// This page provides a simple form to create a new cause using the backend endpoints.
// It preserves existing styling by composing basic form controls; colors are inherited
// from global styles where applicable.

const CauseCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [organizerId, setOrganizerId] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const toast = useToast();

  useEffect(() => {
    // Try to infer organizer from JWT stored user_id; fall back to saved organizer_id
    try {
      const jwtUser = apiService.getStoredUserId && apiService.getStoredUserId();
      if (jwtUser) {
        setOrganizerId(jwtUser);
        return;
      }
      const savedOrganizer = window.localStorage.getItem('organizer_id');
      if (savedOrganizer) setOrganizerId(savedOrganizer);
    } catch (_) {}
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      if (!name || !description || !organizerId) {
        toast.warning('Please fill in all required fields.');
        setSubmitting(false);
        return;
      }
      const payload = {
        name,
        description,
        organizer_id: organizerId,
        target_amount: targetAmount || undefined,
        category_data: categoryName ? { name: categoryName } : undefined,
        cover_image: coverImage || undefined,
      };
      // API call to create cause
      await apiService.createCause(payload);
      toast.success('Cause created successfully.');
      setTimeout(() => navigate(-1), 1200);
      setName('');
      setDescription('');
      setTargetAmount('');
      setCategoryName('');
      setCoverImage(null);
    } catch (err) {
      const msg = String(err && err.message ? err.message : '');
      if (msg.includes('400') || msg.toLowerCase().includes('required')) {
        toast.error('Please update required fields: name, description, organizer id.');
      } else {
        toast.error('System issue. Taking you back.');
        setTimeout(() => navigate(-1), 1000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <SidebarNav />
      <div className={styles.container} style={{ padding: 24, flex:1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h1 style={{ margin: 0 }}>Create a Cause</h1>
          <button type="button" onClick={()=> navigate(-1)} style={{ background:'transparent', border:'1px solid #e5e7eb', borderRadius:8, padding:'8px 12px', cursor:'pointer' }}>Back</button>
        </div>
        <form onSubmit={onSubmit} style={{ maxWidth: 720 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Target amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Category name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Organizer ID (UUID)</label>
          <input
            type="text"
            value={organizerId}
            onChange={(e) => setOrganizerId(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Cover image</label>
          <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)} />
        </div>
        <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
        <div style={{ fontSize: 12, color: '#555', marginTop: 8 }}>Note: Required fields are Name, Description, Organizer ID.</div>
        {message ? <div style={{ marginTop: 8 }}>{message}</div> : null}
      </form>
    </div>
  </div>
  );
};

export default CauseCreate;

