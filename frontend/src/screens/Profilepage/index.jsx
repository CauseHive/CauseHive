import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import SidebarNav from "../../components/SidebarNav";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingCart } from "lucide-react";
import apiService from "../../services/apiService";
import { useToast } from "../../components/Toast/ToastProvider";

const Profilepage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [myCauses, setMyCauses] = useState([]);

  useEffect(() => {
    (async () => {
      try { const p = await apiService.getProfile(); setProfile(p); } catch (e) { toast.error('Failed to load profile'); }
      try {
        const userId = apiService.getStoredUserId && apiService.getStoredUserId();
        const resp = await apiService.getCausesList();
        const causes = Array.isArray(resp) ? resp : (resp.results || []);
        const mine = userId ? causes.filter(c => String(c.organizer_id) === String(userId)) : [];
        setMyCauses(mine);
      } catch (_) {}
    })();
  }, [toast]);

  const name = useMemo(() => {
    if (!profile) return '—';
    const first = profile.first_name || profile.first || profile.given_name || '';
    const last = profile.last_name || profile.last || profile.family_name || '';
    const full = `${first} ${last}`.trim();
    return full || profile.name || profile.username || profile.email || '—';
  }, [profile]);

  const occupation = profile?.occupation || profile?.job_title || '—';
  const email = profile?.email || '—';
  const interests = profile?.interests || profile?.bio || '—';
  const phone = profile?.phone_number || profile?.phone || '—';
  const address = profile?.address || '—';

  const createdCount = myCauses.length;
  const activeCount = myCauses.filter(c => String(c.status || '').toLowerCase() === 'active' || c.active === true).length;

  const coverUrl = profile?.cover_photo ? `${apiService.baseURL}${profile.cover_photo}` : '';
  const avatarUrl = profile?.profile_picture ? `${apiService.baseURL}${profile.profile_picture}` : 'https://i.pravatar.cc/100';

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <SidebarNav />

      {/* Main Content */}
      <div className={styles.main}>
        {/* Top bar with back, search cluster, cart and profile */}
        <div className={styles.topBar}>
          <button onClick={()=> navigate(-1)} style={{ background:'transparent', border:'1px solid #e5e7eb', borderRadius:8, padding:'6px 10px', cursor:'pointer', marginRight:'auto' }}>Back</button>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div title="Cart" style={{ cursor:'pointer' }} onClick={()=> navigate('/cartpage')}><ShoppingCart /></div>
            <img src={avatarUrl} alt={name} className={styles.topAvatar} onClick={()=> navigate('/profilepage')} style={{ cursor:'pointer' }} />
            <span className={styles.username}>{name}</span>
          </div>
        </div>

        {/* Cover Banner */}
        <div className={styles.banner} style={{ background: coverUrl ? `url(${coverUrl}) center/cover no-repeat` : '#fff' }} />

        {/* Profile Avatar */}
        <div className={styles.profilePicWrapper}>
          <img
            src={avatarUrl}
            alt={name}
            className={styles.profilePic}
          />
          <CheckCircle className={styles.verifyBadge} />
        </div>

        {/* Profile Details */}
        <div className={styles.profileSection}>
          <div className={styles.profileBox}>
            <div className={styles.boxHeader}>
              <b>Name</b> {name}
            </div>
            <p><b>Occupation</b><br />{occupation}</p>
            <p><b>Email</b><br />{email}</p>
            <p><b>Interests</b><br />{interests}</p>
            <p><b>Contact</b><br />{phone}</p>
            <p><b>Address</b><br />{address}</p>
          </div>

          <div className={styles.profileBox}>
            <p><b>Created Causes:</b> {createdCount}</p>
            <p><b>Active Causes:</b> {activeCount}</p>
            <div style={{ marginTop:8 }}>
              <b>Your Causes</b>
              <ul>
                {myCauses.slice(0,6).map(c => (<li key={c.id}>{c.name || c.title}</li>))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>2025 <b>CauseHive.</b></div>
      </div>
    </div>
  );
};

export default Profilepage;
