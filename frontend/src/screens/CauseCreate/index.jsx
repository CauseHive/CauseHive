import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import apiService from '../../services/apiService';

// This page provides a simple form to create a new cause using the backend endpoints.
// It preserves existing styling by composing basic form controls; colors are inherited
// from global styles where applicable.

const CauseCreate = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [organizerId, setOrganizerId] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // If a user token exists, backend will infer authenticated user for some flows,
    // but organizer_id is explicitly required by the API serializer.
    try {
      const savedOrganizer = window.localStorage.getItem('organizer_id');
      if (savedOrganizer) setOrganizerId(savedOrganizer);
    } catch (_) {}
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const payload = {
        name,
        description,
        target_amount: targetAmount,
        organizer_id: organizerId,
        category_data: categoryName ? { name: categoryName } : undefined,
        cover_image: coverImage,
      };
      await apiService.createCause(payload);
      setMessage('Cause submitted for review.');
      setName('');
      setDescription('');
      setTargetAmount('');
      setCategoryName('');
      setCoverImage(null);
    } catch (err) {
      setMessage('Failed to create cause');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container} style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Create a Cause</h1>
      <form onSubmit={onSubmit} style={{ maxWidth: 640 }}>
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
            required
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
        {message ? <div style={{ marginTop: 8 }}>{message}</div> : null}
      </form>
    </div>
  );
};

export default CauseCreate;

