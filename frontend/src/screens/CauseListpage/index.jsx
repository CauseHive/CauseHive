import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import PaulStatamImage from '../../assets/PaulStatamImage.png';
import Causelist_image1 from '../../assets/Causelist_image1.png';
import Causelist_image2 from '../../assets/Causelist_image2.png';
import apiService from '../../services/apiService';
import SidebarNav from '../../components/SidebarNav';
import { useToast } from '../../components/Toast/ToastProvider';

const CauseListpage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [cartCount, setCartCount] = useState(2);
  const [causes, setCauses] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('Date created');
  const [sortOpen, setSortOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiService.getCausesList(page);
        const results = Array.isArray(data) ? data : (data.results || []);
        if (mounted) setCauses(results || []);
      } catch (e) {
        if (mounted) setCauses([]);
      }
    })();
    return () => { mounted = false; };
  }, [page]);

  const fallbackCauses = [
    { id: '1', image: Causelist_image1, name: 'Donation for riverside chat in Nuevo', description: 'Seeking to support indigenous locals l...' },
    { id: '2', image: Causelist_image2, name: 'Donation for riverside chat in Nuevo', description: 'Seeking to support indigenous locals l...' },
    { id: '3', name: 'Donation for riverside chat in Nuevo', description: 'Seeking to support indigenous locals l...' },
    { id: '4', name: 'Donation for riverside chat in Nuevo', description: 'Seeking to support indigenous locals l...' },
    { id: '5', name: 'Donation for riverside chat in Nuevo', description: 'Seeking to support indigenous locals l...' },
    { id: '6', name: 'Donation for riverside chat in Nuevo', description: 'Seeking to support indigenous locals l...' },
    { id: '7', name: 'Donation for riverside chat in Nuevo', description: 'Seeking to support indigenous locals l...' },
    { id: '8', name: 'Donation for riverside chat in Nuevo', description: 'Seeking to support indigenous locals l...' },
  ];

  const itemsRaw = (causes && causes.length ? causes : fallbackCauses);

  const items = useMemo(() => {
    const arr = [...itemsRaw];
    // basic text filter by name/description
    const filtered = search
      ? arr.filter(c => (c.name || c.title || '').toLowerCase().includes(search.toLowerCase()) || (c.description || '').toLowerCase().includes(search.toLowerCase()))
      : arr;
    switch (sortBy) {
      case 'Category':
        return filtered.sort((a,b) => String(a.category || '').localeCompare(String(b.category || '')));
      case 'Popularity':
        return filtered.sort((a,b) => Number(b.current_amount || 0) - Number(a.current_amount || 0));
      case 'Amount':
      case 'Goal amount':
        return filtered.sort((a,b) => Number(b.target_amount || 0) - Number(a.target_amount || 0));
      case 'Created by':
      case 'Created by ': // safety
        return filtered.sort((a,b) => String(a.organizer_id || '').localeCompare(String(b.organizer_id || '')));
      case 'Date created':
      default:
        return filtered.sort((a,b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }
  }, [itemsRaw, sortBy, search]);

 

  const handleAddToCart = async (id) => {
    try {
      const result = await apiService.addToCart({ cause_id: id, donation_amount: 10, quantity: 1 });
      if (result && result.item) {
        setCartCount((c) => c + 1);
        toast.success('Added to cart');
      } else {
        toast.error('Unable to add to cart');
      }
    } catch (e) {
      console.error('Failed to add to cart', e);
      toast.error('Failed to add to cart');
    }
  };

  const renderCard = (cause) => {
    const title = cause.title || cause.name;
    const desc = cause.description || '';
    const id = cause.id;
    const img = cause.image || (cause.cover_image ? `${apiService.baseURL}${cause.cover_image}` : null);
    return (
      <div key={id} className={styles.causeCard}>
        <div className={styles.causeImageWrap}>
          {img ? (
            <img src={img} alt={title} className={styles.causeImage} />
          ) : null}
        </div>
        <div className={styles.causeDetails}>
          <h3 className={styles.causeTitle} title={title}>
            <Link to={`/causes/${id}`}>{title}</Link>
          </h3>
          <p className={styles.causeDescription}>{desc}</p>
          <div className={styles.cardActions}>
            <button className={styles.addToCartButton} onClick={() => handleAddToCart(id)}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  const left = items.slice(0, Math.ceil(items.length / 2));
  const right = items.slice(Math.ceil(items.length / 2));

  return (
    <div className={styles.container}>
      <SidebarNav />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Causes</h1>
            <input
              type="text"
              className={styles.searchField}
              placeholder="Search causes"
              value={search}
              onChange={(e)=> setSearch(e.target.value)}
              aria-label="Search causes"
            />
            <div className={styles.filter} role="button" tabIndex={0} onClick={()=> setSortOpen(v=>!v)} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); setSortOpen(v=>!v);} }} aria-haspopup="menu" aria-expanded={sortOpen}>
              <input
                type="text"
                placeholder={"Sort: " + sortBy}
                className={styles.filterInput}
                readOnly
                aria-readonly
              />
              <svg width="10" height="6" viewBox="0 0 10 6" fill="#666" className={styles.dropdownIcon}>
                <path d="M0 0l5 6 5-6z" />
              </svg>
              {sortOpen && (
                <div className={styles.dropdown} role="menu">
                  <button className={styles.dropdownItem} onClick={(e)=>{ e.stopPropagation(); setSortBy('Date created'); setSortOpen(false); }}>Date created</button>
                  <button className={styles.dropdownItem} onClick={(e)=>{ e.stopPropagation(); setSortBy('Popularity'); setSortOpen(false); }}>Popularity</button>
                  <button className={styles.dropdownItem} onClick={(e)=>{ e.stopPropagation(); setSortBy('Created by'); setSortOpen(false); }}>Created by</button>
                  <button className={styles.dropdownItem} onClick={(e)=>{ e.stopPropagation(); setSortBy('Category'); setSortOpen(false); }}>Category</button>
                  <button className={styles.dropdownItem} onClick={(e)=>{ e.stopPropagation(); setSortBy('Goal amount'); setSortOpen(false); }}>Goal amount</button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.headerControls}>
            <div className={styles.cart} onClick={()=>navigate('/cartpage')}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#666" className={styles.cartIcon}>
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-0.16 0.28-0.25 0.61-0.25 0.96 0 1.1 0.9 2 2 2h10v-2H7.42c-0.14 0-0.25-0.11-0.25-0.25l0.03-0.12 0.9-1.63h7.45c0.75 0 1.41-0.41 1.75-1.03l3.58-6.49c0.08-0.14 0.12-0.31 0.12-0.48 0-0.41-0.33-0.75-0.75-0.75H5.21l-0.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s0.89 2 1.99 2 2-0.9 2-2-0.9-2-2-2z" />
              </svg>
              <span className={styles.cartCount}>{cartCount}</span>
            </div>
            <img src={PaulStatamImage} alt="Profile" className={styles.profileIcon} onClick={()=>navigate('/profilepage')} />
          </div>
        </header>
        <div className={styles.content}>
          <div className={styles.causeGrid}>
            <div className={styles.leftColumn}>
              {left.map(renderCard)}
            </div>
            <div className={styles.rightColumn}>
              {right.map(renderCard)}
            </div>
          </div>
        </div>
        {/* Pagination controls */}
        <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0' }}>
          <button onClick={()=> setPage((p)=> Math.max(1, p-1))} disabled={page<=1} style={{ background:'transparent', border:'none', color:'#1e40af', cursor: page<=1 ? 'default':'pointer' }}>Previous</button>
          <button onClick={()=> setPage((p)=> p+1)} style={{ background:'transparent', border:'none', color:'#1e40af', cursor:'pointer' }}>Next</button>
        </div>
      </main>
    </div>
  );
};

export default CauseListpage;
