import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import apiService from '../../services/apiService';

const CauseReviewPage = () => {
  const navigate = useNavigate();
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectionReasons, setRejectionReasons] = useState({});

  const fetchCauses = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPendingCauses();
      setCauses(data.results);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  const handleApprove = async (causeId) => {
    try {
      await apiService.updateCauseStatus(causeId, { status: 'approved' });
      fetchCauses(); // Refresh the list
    } catch (error) {
      console.error("Failed to approve cause:", error);
    }
  };

  const handleReject = async (causeId) => {
    try {
      const reason = rejectionReasons[causeId];
      if (!reason) {
        alert("Please provide a reason for rejection.");
        return;
      }
      await apiService.updateCauseStatus(causeId, { status: 'rejected', rejection_reason: reason });
      fetchCauses(); // Refresh the list
    } catch (error) {
      console.error("Failed to reject cause:", error);
    }
  };

  const handleReasonChange = (causeId, reason) => {
    setRejectionReasons(prev => ({ ...prev, [causeId]: reason }));
  };

  if (loading) return <p>Loading pending causes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {/* ... sidebar icons ... */}
      </aside>
      <main className={styles.main}>
        <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>Back</button>
        <h2 className={styles.sectionTitle}>Pending Causes for Review</h2>
        <div className={styles.pendingCauses}>
          {causes.map((cause) => (
            <div key={cause.id} className={styles.causeCard}>
              <h3>{cause.title}</h3>
              <p>{cause.description}</p>
              <div className={styles.reviewActions}>
                <button onClick={() => handleApprove(cause.id)} className={styles.approveBtn}>Approve</button>
                <input
                  type="text"
                  placeholder="Reason for rejection"
                  className={styles.rejectionInput}
                  value={rejectionReasons[cause.id] || ''}
                  onChange={(e) => handleReasonChange(cause.id, e.target.value)}
                />
                <button onClick={() => handleReject(cause.id)} className={styles.rejectBtn}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CauseReviewPage;