import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import apiService from "../../services/apiService";

const Icon = ({ path, box = "0 0 24 24", size = 22, label }) => (
  <svg
    className={styles.iconSvg}
    viewBox={box}
    width={size}
    height={size}
    aria-hidden={label ? undefined : true}
    role={label ? "img" : "presentation"}
  >
    {label ? <title>{label}</title> : null}
    <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const useSidebarIcons = () => useMemo(() => ([
  { key: "menu", path: "M3 6h18M3 12h18M3 18h18", label: "Menu" },
  { key: "grid", path: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z", label: "Dashboard" },
  { key: "heart", path: "M20.8 8.6a4.8 4.8 0 0 0-6.8 0L12 10.6l-2-2a4.8 4.8 0 0 0-6.8 6.8l2 2L12 22l6.8-4.6 2-2a4.8 4.8 0 0 0 0-6.8z", label: "Favourites" },
  { key: "chat", path: "M21 15a4 4 0 0 1-4 4H8l-5 3 1.5-4A4 4 0 0 1 4 6h13a4 4 0 0 1 4 4z", label: "Messages" },
  { key: "layers", path: "M12 2l9 5-9 5-9-5 9-5zm-7 9l7 4 7-4m-14 4l7 4 7-4", label: "Layers" },
  { key: "gift", path: "M20 12v8H4v-8m16 0H4m16-4H4v4h16V8zm-8 0V4m0 0a2 2 0 1 1 0 4m0-4a2 2 0 1 0 0 4", label: "Gifts" },
  { key: "user", path: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", label: "Profile" },
  { key: "settings", path: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm8-3.5l-1.5-.9.3-1.7-1.7-1.7-1.7.3L14.5 4h-5L8.6 6l-1.7-.3-1.7 1.7.3 1.7L4 12l1.5.9-.3 1.7 1.7 1.7 1.7-.3L9.5 20h5l.9-1.5 1.7.3 1.7-1.7-.3-1.7L20 12z", label: "Settings" },
  { key: "power", path: "M12 2v8m6.4-4.4a8 8 0 1 1-12.8 0", label: "Power" },
]), []);

const CartPage = () => {
  const icons = useSidebarIcons();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState({});

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCart();
      setCart(data.cart);
      // Also fetch cause details for each item
      const itemsWithDetails = await Promise.all(data.cart.items.map(async item => {
        const causeDetails = await apiService.getCauseById(item.cause_id);
        return { ...item, cause: causeDetails };
      }));
      setCart(prev => ({ ...prev, items: itemsWithDetails }));
      // Initialize selected state
      const initialSelected = {};
      itemsWithDetails.forEach(item => initialSelected[item.id] = true);
      setSelected(initialSelected);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const toggleRow = (id) => setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleRemove = async (itemId) => {
    try {
        await apiService.removeFromCart(itemId);
        fetchCart(); // Refetch cart after removal
    } catch (error) {
        setError(error.message);
    }
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        {/* ... sidebar icons ... */}
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.content}>
        <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>Back</button>
        {/* Top bar */}
        <div className={styles.topbar}>
          {/* ... top bar ... */}
        </div>

        {/* Title */}
        <h1 className={styles.title}>Your Cart</h1>

        {/* List */}
        <div className={styles.list}>
          {cart && cart.items.map((item) => (
            <div key={item.id} className={styles.row}>
              <button
                onClick={() => toggleRow(item.id)}
                className={`${styles.tick} ${selected[item.id] ? styles.tickOn : ""}`}
                aria-pressed={!!selected[item.id]}
                aria-label={`Select ${item.cause.title}`}
              />
              <div className={styles.card}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardTitle}>{item.cause.title}</span>
                  <span className={styles.cardDim}>Goal: GHS{item.cause.goal_amount}</span>
                  <span className={styles.cardDim}>Created by: {item.cause.organizer_name}</span>
                </div>
                <div className={styles.amountBox}>
                  <span className={styles.amountText}>GHS {item.donation_amount}</span>
                  <span className={styles.amountCaret}>▾</span>
                </div>
                <button onClick={() => handleRemove(item.id)} className={styles.removeBtn}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className={styles.checkoutBar}>
          <div className={styles.selectedText}>{selectedCount} selected</div>
          <button className={styles.checkoutBtn} onClick={() => navigate('/multidonation')}>Checkout</button>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
