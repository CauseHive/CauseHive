import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import {
  Menu,
  SlidersHorizontal,
  Grid,
  Heart,
  MessageSquare,
  Layers,
  Calendar,
  User,
  Settings,
  Power,
  ShoppingCart,
  ChevronDown,
  RotateCcw,
  ChevronUp,
} from "lucide-react";
import apiService from "../../services/apiService";

const DonationHistory = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("Amount");

  const filters = ["Date", "Amount", "Organizer", "Category"];

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDonations();
        const donationsWithCauseDetails = await Promise.all(
          data.results.map(async (donation) => {
            const cause = await apiService.getCauseById(donation.cause_id);
            return { ...donation, cause };
          })
        );
        setDonations(donationsWithCauseDetails);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, []);

  if (loading) return <p>Loading donation history...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.app}>
      {/* Sidebar can be a separate component */}
      <aside className={styles.sidebar}>
        {/* ... sidebar icons ... */}
      </aside>

      <main className={styles.main}>
        <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>Back</button>
        <div className={styles.topRow}>
          {/* ... top row ... */}
        </div>

        <div className={styles.content}>
          <h1 className={styles.heading}>Donation History</h1>

          <div className={styles.filterBar}>
            {/* ... filter bar ... */}
          </div>

          <div className={styles.cards}>
            {donations.map((donation) => (
              <div key={donation.id} className={styles.card}>
                <span className={styles.cardTitle}>{donation.cause.title}</span>
                <span className={styles.cardAmount}>GHS {donation.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonationHistory;
