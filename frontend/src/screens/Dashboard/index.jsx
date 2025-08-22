import React from "react"; 
import styles from "./styles.module.css";
import apiService from "../../services/apiService";
import { useToast } from "../../components/Toast/ToastProvider";
import {
  Bell,
  ShoppingCart,
  User,
  Grid,
  Heart,
  MessageSquare,
  Layers,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [myCauses, setMyCauses] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [popularCauses, setPopularCauses] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const userId = apiService.getStoredUserId && apiService.getStoredUserId();
        // Fetch causes and filter to user's own
        const causesResp = await apiService.getCausesList();
        const causes = Array.isArray(causesResp) ? causesResp : (causesResp.results || []);
        const mine = userId ? causes.filter(c => String(c.organizer_id) === String(userId)) : [];
        if (mounted) setMyCauses(mine.slice(0, 3));

        // Fetch recent donations (3) and enrich with cause titles
        const donationsResp = await apiService.getDonations();
        const donationsArr = Array.isArray(donationsResp) ? donationsResp : (donationsResp.results || []);
        // sort by donated_at desc if available
        donationsArr.sort((a, b) => new Date(b.donated_at || 0) - new Date(a.donated_at || 0));
        const topThree = donationsArr.slice(0, 3);
        const withTitles = await Promise.all(topThree.map(async (d) => {
          try {
            const cd = d.cause_id ? await apiService.getCauseDetails(d.cause_id) : null;
            return { ...d, cause_title: cd?.name || cd?.title || String(d.cause_id).slice(0,8) };
          } catch (_) {
            return { ...d, cause_title: String(d.cause_id).slice(0,8) };
          }
        }));
        if (mounted) setRecentDonations(withTitles);

        // Popular causes by amount raised (current_amount desc)
        const popular = [...causes].sort((a, b) => Number(b.current_amount || 0) - Number(a.current_amount || 0));
        if (mounted) setPopularCauses(popular.slice(0, 6));
      } catch (_) {
        // keep defaults
      }
    })();
    return () => { mounted = false; };
  }, []);

  const go = (path) => () => navigate(path);
  const logout = () => {
    try {
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
      window.localStorage.removeItem('user_id');
      window.localStorage.removeItem('cart_id');
    } catch (_) {}
    toast.info('Logged out');
    navigate('/');
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <button className={styles.menuBtn} aria-label="Menu">☰</button>
        </div>
        <nav className={styles.nav} aria-label="Main">
          <button className={styles.navItem} aria-label="Dashboard" onClick={go('/dashboard')}><Grid /></button>
          <button className={styles.navItem} aria-label="Favorites" onClick={go('/desktoppage')}><Heart /></button>
          <button className={styles.navItem} aria-label="Notifications" onClick={go('/notificationspage')}><MessageSquare /></button>
          <button className={styles.navItem} aria-label="Causes" onClick={go('/causelistpage')}><Layers /></button>
          <button className={styles.navItem} aria-label="Create Cause" onClick={go('/causes/create')}><Calendar /></button>
        </nav>
        <div className={styles.sidebarBottom}>
          <button className={styles.navItem} aria-label="Profile" onClick={go('/profilepage')}><User /></button>
          <button className={styles.navItem} aria-label="Settings" onClick={go('/profilesettings')}><Settings /></button>
          <button className={styles.navItem} aria-label="Logout" onClick={logout}><LogOut /></button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* HEADER (Top row): Search + Bell + Profile */}
        <header className={styles.header}>
          <div className={styles.searchContainer}>
            {/* Removed the search icon */}
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
              aria-label="Search"
            />
          </div>

          <div className={styles.headerRight}>
            <div className={styles.iconWrapper} aria-label="Notifications">
              <Bell />
              <span className={styles.badge}>9</span>
            </div>

            <div className={styles.profile}>
              <img
                src="https://i.pravatar.cc/40"
                alt="Moni Roy"
                className={styles.avatar}
                onClick={()=>navigate('/profilepage')}
              />
              <div className={styles.profileInfo}>
                <p className={styles.profileName}>Moni Roy</p>
                <p className={styles.profileRole}>Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Second row: Dashboard (left) + Cart (right) */}
        <div className={styles.topBar}>
          <h2 className={styles.title}>
            Dashboard <User className={styles.userIcon} />
          </h2>
          <div className={styles.iconWrapper} aria-label="Cart" onClick={go('/cartpage')} style={{ cursor:'pointer' }}>
            <ShoppingCart />
            <span className={styles.badge}>2</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <section className={styles.topSection}>
          <div className={styles.welcomeBox}>Welcome, User.</div>
          <div className={styles.causesBox}>
            <h4>Your Causes</h4>
            <div className={styles.causesCards}>
              {myCauses.length > 0 ? (
                myCauses.map((c) => (
                  <div key={c.id} className={styles.causeCard}>
                    <span className={styles.causeText} title={c.name || c.title}>{c.name || c.title}</span>
                  </div>
                ))
              ) : (
                [0,1,2].map((i) => <div key={i} className={styles.causeCard}></div>)
              )}
            </div>
          </div>
        </section>

        <section className={styles.recentDonations}>
          <h3>Your recent donations</h3>
          <div className={styles.donationsRow}>
            {recentDonations.length > 0 ? (
              recentDonations.map((d) => (
                <div key={d.id} className={styles.donationCard}>
                  <div className={styles.donationText} title={d.cause_title}>{d.cause_title}</div>
                  <div className={styles.donationAmt}>GHS {d.amount}</div>
                </div>
              ))
            ) : (
              [0,1,2].map((i) => <div key={i} className={styles.donationCard}></div>)
            )}
          </div>
        </section>

        <section className={styles.popularCauses}>
          <div className={styles.tableHeader}>
            <h3>Popular Causes</h3>
            <select className={styles.dropdown} aria-label="Month">
              <option>October</option>
            </select>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cause name</th>
                <th>Location</th>
                <th>Date - Time</th>
                <th>Category</th>
                <th>Amount raised</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {popularCauses.length > 0 ? (
                popularCauses.map((c) => (
                  <tr key={c.id}>
                    <td className={styles.tableCause}>
                      <span className={styles.causeIcon}>⌂</span>
                      {c.name || c.title}
                    </td>
                    <td>{c.location || '—'}</td>
                    <td>{c.created_at ? new Date(c.created_at).toLocaleString() : '—'}</td>
                    <td>{(c.category && c.category.name) ? c.category.name : (c.category || '—')}</td>
                    <td>GHS {c.current_amount || 0}</td>
                    <td><span className={styles.status}>{c.status || '—'}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ color: '#6b7280' }}>No popular causes available</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
