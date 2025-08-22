import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import apiService from "../../services/apiService";
import SidebarNav from "../../components/SidebarNav";
import { useToast } from "../../components/Toast/ToastProvider";


const CartPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(apiService.getStoredCartId());
  const [metaByCause, setMetaByCause] = useState({}); // cause_id -> { name, category }
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [showCat, setShowCat] = useState(false);
  const [profile, setProfile] = useState(null);

  const searchRef = useRef(null);
  const refetchCart = async () => {
    try {
      const id = apiService.getStoredCartId();
      const query = id ? `?cart_id=${encodeURIComponent(id)}` : '';
      const res = await apiService.getCart(query);
      if (res && res.cart_id) setCartId(res.cart_id);
      const arr = res && res.items ? res.items : [];
      setItems(arr);
    } catch (e) {
      setItems([]);
    }
  };

  useEffect(() => {
    (async () => {
      await refetchCart();
      try { const p = await apiService.getProfile(); setProfile(p); } catch (_) {}
    })();

    const onFocus = () => { refetchCart(); };
    const onStorage = (e) => { if (e.key === 'cart_id') refetchCart(); };
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const [selected, setSelected] = useState({}); // track selection by item id

  // Enrich cart rows with cause metadata for filtering/search
  useEffect(() => {
    (async () => {
      const needed = Array.from(new Set((items || []).map(r => String(r.cause_id)))).filter(cid => !metaByCause[cid]);
      if (!needed.length) return;
      const entries = await Promise.all(needed.map(async (cid) => {
        try {
          const cd = await apiService.getCauseDetails(cid);
          return [cid, { name: cd?.name || cd?.title || String(cid).slice(0,8), category: (cd?.category && cd.category.name) ? cd.category.name : (cd?.category || 'Uncategorized') }];
        } catch (_) {
          return [cid, { name: String(cid).slice(0,8), category: 'Uncategorized' }];
        }
      }));
      setMetaByCause(prev => ({ ...prev, ...Object.fromEntries(entries) }));
    })();
  }, [items, metaByCause]);

  const categories = useMemo(() => {
    const set = new Set();
    (items || []).forEach(r => {
      const meta = metaByCause[String(r.cause_id)];
      if (meta && meta.category) set.add(meta.category);
    });
    return ['All', ...Array.from(set).sort((a,b)=> String(a).localeCompare(String(b)))];
  }, [items, metaByCause]);

  const filteredItems = useMemo(() => {
    let arr = items || [];
    if (category && category !== 'All') {
      arr = arr.filter(r => (metaByCause[String(r.cause_id)]?.category || '') === category);
    }
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      arr = arr.filter(r => {
        const meta = metaByCause[String(r.cause_id)] || {};
        return (meta.name || '').toLowerCase().includes(s) || String(r.cause_id).toLowerCase().includes(s);
      });
    }
    return arr;
  }, [items, category, searchTerm, metaByCause]);

  const toggleRow = (id) => setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  const selectedCount = Object.values(selected).filter(Boolean).length;

  const increaseQty = async (row) => {
    const newQty = (row.quantity || 1) + 1;
    try {
      await apiService.updateCartItem(row.id, { cart_id: cartId, quantity: newQty });
      setItems((prev) => prev.map((it) => it.id === row.id ? { ...it, quantity: newQty } : it));
    } catch (e) {}
  };
  const decreaseQty = async (row) => {
    const newQty = Math.max(0, (row.quantity || 1) - 1);
    if (newQty === 0) {
      try {
        await apiService.removeFromCart(row.id, { cart_id: cartId });
        setItems((prev) => prev.filter((it) => it.id !== row.id));
      } catch (e) {}
      return;
    }
    try {
      await apiService.updateCartItem(row.id, { cart_id: cartId, quantity: newQty });
      setItems((prev) => prev.map((it) => it.id === row.id ? { ...it, quantity: newQty } : it));
    } catch (e) {}
  };
  const checkout = async () => {
    const selectedRows = filteredItems.filter(r => selected[r.id]);
    if (!selectedRows.length) {
      toast.info('Select at least one item to proceed');
      return;
    }
    if (selectedRows.length === 1) {
      const row = selectedRows[0];
      const amt = row.donation_amount || 0;
      navigate(`/donation?causeId=${encodeURIComponent(row.cause_id)}&amount=${encodeURIComponent(String(amt))}`);
      return;
    }
    navigate('/multidonation');
  };

  return (
    <div className={styles.page}>
      {/* LEFT SIDEBAR */}
      <SidebarNav />

      {/* MAIN CONTENT */}
      <main className={styles.content}>
        {/* Top bar */}
        <div className={styles.topbar}>
          <div className={styles.brand}>CauseHive<span className={styles.brandDot}>.</span></div>

          <div className={styles.searchWrap}>
            <input ref={searchRef} className={styles.search} placeholder="Search in cart" value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)} />
            <button className={styles.searchBtn} onClick={()=> { try { searchRef.current && searchRef.current.focus(); } catch(_){} }}>Search</button>
          </div>

          <div className={styles.userWrap}>
            <div className={styles.avatar} onClick={()=> navigate('/profilepage')}>
              {profile && profile.profile_picture ? (
                <img src={`${apiService.baseURL}${profile.profile_picture}`} alt="User" className={styles.avatarImg} />
              ) : (
                <img src="https://i.pravatar.cc/40" alt="User" className={styles.avatarImg} />
              )}
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className={styles.filtersRow}>
          <div className={styles.filterPill} style={{ position:'relative' }}>
            <input className={styles.filterInput} value={category} readOnly onClick={()=> setShowCat(v=>!v)} aria-label="Category" />
            <span className={styles.pillCaret} onClick={()=> setShowCat(v=>!v)}>▾</span>
            {showCat ? (
              <div style={{ position:'absolute', top:42, left:0, background:'#fff', border:'1px solid #e6e8ef', borderRadius:8, boxShadow:'0 2px 4px rgba(16,24,40,0.06)', zIndex:10, minWidth:180 }}>
                {categories.map((c)=> (
                  <button key={c} onClick={()=> { setCategory(c); setShowCat(false); }} style={{ width:'100%', textAlign:'left', padding:'8px 10px', background:'transparent', border:'none', cursor:'pointer' }}>{c}</button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Title */}
        <h1 className={styles.title}>Your Cart</h1>

        {/* List */}
        <div className={styles.list}>
          {(filteredItems.length ? filteredItems : []).map((row) => (
            <div key={row.id} className={styles.row}>
              {/* left select */}
              <button
                onClick={() => toggleRow(row.id)}
                className={`${styles.tick} ${selected[row.id] ? styles.tickOn : ""}`}
                aria-pressed={!!selected[row.id]}
                aria-label={`Select ${row.title || row.cause_id}`}
              />
              {/* card */}
              <div className={styles.card}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardTitle}>{row.title || `Cause ${String(row.cause_id).slice(0,8)}...`}</span>
                  <span className={styles.cardDim}>Qty: {row.quantity || 1}</span>
                  {/* Amount entry removed as per request */}
                </div>

                <div className={styles.amountBox}>
                  <button onClick={() => decreaseQty(row)} className={styles.qtyBtn} style={{ marginRight: 8 }}>-</button>
                  <span className={styles.amountText}>GHS {(row.donation_amount || 0) * (row.quantity || 1)}</span>
                  <button onClick={() => increaseQty(row)} className={styles.qtyBtn} style={{ marginLeft: 8 }}>+</button>
                </div>
              </div>
            </div>
          ))}
          {!filteredItems.length ? (
            <div style={{ padding: '20px', color: '#6b7280' }}>No items in your cart.</div>
          ) : null}
        </div>

        {/* Bottom bar */}
        <div className={styles.checkoutBar}>
          <div className={styles.selectedText}>{selectedCount} selected</div>
          <button className={styles.checkoutBtn} onClick={checkout}>Checkout</button>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
