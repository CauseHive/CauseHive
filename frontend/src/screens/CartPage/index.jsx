import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import styles from './styles.module.css';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity);
    onUpdateQuantity(item.id, newQuantity);
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.cartItemInfo}>
        <Link to={`/causes/${item.cause.id}`}>
          <img src={item.cause.image_url || 'https://via.placeholder.com/100'} alt={item.cause.title} className={styles.causeImage} />
        </Link>
        <div>
          <Link to={`/causes/${item.cause.id}`} className={styles.causeTitleLink}>
            {item.cause.title}
          </Link>
          <p>Goal: ${item.cause.goal_amount}</p>
          <button onClick={() => onRemove(item.id)} className={styles.removeButton}>Remove</button>
        </div>
      </div>
      <div className={styles.priceBox}>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
          className={styles.quantityInput}
        />
        <span>${(item.cause.goal_amount / 100) * quantity}</span> {/* Example calculation */}
      </div>
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await apiService.getCart();
      setCart(cartData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cart. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await apiService.removeFromCart(itemId);
      fetchCart(); // Refresh cart after removing
    } catch (err) {
      alert('Failed to remove item.');
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await apiService.updateCartItem(itemId, quantity);
      fetchCart(); // Refresh cart after updating
    } catch (err) {
      alert('Failed to update quantity.');
    }
  };

  const handleCheckout = () => {
    // Navigate to a checkout page, which is not yet created
    navigate('/checkout');
  };

  if (loading) return <p>Loading your cart...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

  const totalAmount = cart.items.reduce((total, item) => total + (item.cause.goal_amount / 100) * item.quantity, 0);

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {/* Sidebar content would go here */}
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <Link to="/" className={styles.logo}><strong>CauseHive.</strong></Link>
          <h2 className={styles.title}>Your Cart</h2>
          <input type="text" placeholder="Search" className={styles.searchInput} />
        </header>

        <section className={styles.cartList}>
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))}
        </section>

        <footer className={styles.footer}>
          <span>Total: ${totalAmount.toFixed(2)}</span>
          <button onClick={handleCheckout} className={styles.checkoutButton}>Checkout</button>
        </footer>
      </main>
    </div>
  );
};

export default CartPage;
