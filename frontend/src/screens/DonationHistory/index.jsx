import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import SidebarNav from "../../components/SidebarNav";
import { useNavigate } from "react-router-dom";
import { ChevronDown, RotateCcw, ChevronUp } from "lucide-react";
import apiService from "../../services/apiService";
import { useToast } from "../../components/Toast/ToastProvider";
import AppTopBar from "../../components/AppTopBar";

const DonationHistory = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("Amount");
  const [sortDir, setSortDir] = useState("desc"); // 'asc' | 'desc'
  const [search, setSearch] = useState("");

  const [donations, setDonations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [titleCache, setTitleCache] = useState({}); // cause_id -> title

  const filters = ["Date", "Amount", "Organizer", "Category"];

  const refetch = React.useCallback(async () => {
    try {
      const data = await apiService.getDonations(1);
      const arr = Array.isArray(data) ? data : (data.results || []);
      setDonations(arr || []);
      // Preload titles (best-effort)
      const uniqueIds = Array.from(new Set((arr || []).map(d => d.cause_id).filter(Boolean))).slice(0, 50);
      const entries = await Promise.all(uniqueIds.map(async (cid) => {
        try { const cd = await apiService.getCauseDetails(cid); return [cid, cd?.name || cd?.title || String(cid).slice(0,8)]; } catch(_) { return [cid, String(cid).slice(0,8)]; }
      }));
      setTitleCache(prev => ({ ...prev, ...Object.fromEntries(entries) }));
    } catch (e) {
      toast.error('Failed to load donation history');
      setDonations([]);
    }
  }, [toast]);

  useEffect(() => {
    (async () => {
      await refetch();
      try { const p = await apiService.getProfile(); setProfile(p); } catch(_) {}
    })();
  }, [refetch]);

  const rows = useMemo(() => {
    const arr = [...(donations || [])].map(d => ({
      ...d,
      cause_title: titleCache[d.cause_id] || (d.cause_id ? String(d.cause_id).slice(0,8) : '—'),
    }));
    // simple search by title or amount
    const filtered = search
      ? arr.filter(d => (String(d.cause_title || '').toLowerCase().includes(search.toLowerCase()) || String(d.amount || '').includes(search)))
      : arr;

    const cmp = (a, b) => {
      switch (filterBy) {
        case 'Date':
          return new Date(a.donated_at || 0) - new Date(b.donated_at || 0);
        case 'Amount':
          return Number(a.amount || 0) - Number(b.amount || 0);
        case 'Organizer':
          return String(a.organizer_id || '').localeCompare(String(b.organizer_id || ''));
        case 'Category':
          return String(a.category || '').localeCompare(String(b.category || ''));
        default:
          return Number(a.amount || 0) - Number(b.amount || 0);
      }
    };
    const sorted = filtered.sort(cmp);
    if (sortDir === 'desc') sorted.reverse();
    return sorted;
  }, [donations, titleCache, search, filterBy, sortDir]);

  const sortAscending = () => setSortDir('asc');
  const sortDescending = () => setSortDir('desc');
  const refresh = async () => { await refetch(); toast.info('Refreshed'); };

  return (
    <div className={styles.app}>
      {/* LEFT SIDEBAR */}
      <SidebarNav />

      {/* MAIN AREA */}
      <main className={styles.main}>
        <AppTopBar
          onBack={()=> navigate(-1)}
          onCart={()=> navigate('/cartpage')}
          onAvatar={()=> navigate('/profilepage')}
          avatarUrl={profile && profile.profile_picture ? `${apiService.baseURL}${profile.profile_picture}` : undefined}
        />
        <div className={styles.topRow}>
          <div style={{ justifySelf:'center', display:'flex' }}>
            <input
              className={styles.globalSearch}
              type="text"
              placeholder="Search donations"
              aria-label="Search"
              value={search}
              onChange={(e)=> setSearch(e.target.value)}
            />
            <button onClick={()=>{}} style={{ marginLeft:10, height:44, padding:'0 16px', borderRadius:999, border:'1px solid #e6e8ef', background:'#fff', cursor:'pointer' }}>Search</button>
          </div>
        </div>

        {/* CONTENT CONTAINER (centred) */}
        <div className={styles.content}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h1 className={styles.heading}>Donation History</h1>
            <button onClick={()=> navigate(-1)} style={{ background:'transparent', border:'1px solid #e5e7eb', borderRadius:8, padding:'6px 10px', cursor:'pointer' }}>Back</button>
          </div>

          {/* FILTER BAR below heading */}
          <div className={styles.filterBar}>
            <input className={styles.inlineSearch} type="text" aria-label="Filter search" placeholder={`Search within ${filterBy.toLowerCase()}`} value={search} onChange={(e)=> setSearch(e.target.value)} />

            <div className={styles.filterBtns}>
              <div className={styles.roundBtn} onClick={() => setFilterOpen((v) => !v)} aria-label="Choose filter">
                <ChevronDown size={16} />
                {filterOpen && (
                  <div className={styles.dropdown} role="menu">
                    {filters.map((f) => (
                      <button
                        key={f}
                        className={styles.dropdownItem}
                        onClick={() => {
                          setFilterBy(f);
                          setFilterOpen(false);
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className={styles.roundBtn} aria-label="Refresh" onClick={refresh}>
                <RotateCcw size={16} />
              </button>

              <button className={styles.roundBtn} aria-label="Sort ascending" onClick={sortAscending}>
                <ChevronUp size={16} />
              </button>
              <button className={styles.roundBtn} aria-label="Sort descending" onClick={sortDescending}>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className={styles.filterHint}>Filter by: {filterBy} • Order: {sortDir}</div>

          {/* DONATION CARDS */}
          <div className={styles.cards}>
            {rows.length ? rows.map((d) => (
              <div key={d.id || `${d.cause_id}-${d.donated_at}`} className={styles.card}>
                <span className={styles.cardTitle}>{d.cause_title}</span>
                <span className={styles.cardAmount}>GHS {Number(d.amount || 0).toFixed(2)}</span>
              </div>
            )) : (
              <div style={{ padding: '12px', color:'#6b7280' }}>{search ? `No results for "${search}"` : 'No donation history yet.'}</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonationHistory;
