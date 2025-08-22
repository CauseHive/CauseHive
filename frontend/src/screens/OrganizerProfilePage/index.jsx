import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import {
  Home,
  Grid,
  Heart,
  MessageCircle,
  Layers,
  Calendar,
  User,
  Settings,
  Power,
  Menu,
  CheckCircle,
} from "lucide-react";
import apiService from "../../services/apiService";

import PaulStatamImage from "../../assets/PaulStatamImage.png"; 
import Thornimage from "../../assets/Thornimage.png"; 
import CircularFemaleImage from "../../assets/Circular_female.png";

const OrganizerProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("grid");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await apiService.getUserProfile();
        setProfile(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className={styles.container}><p>Loading profile...</p></div>;
  }

  if (error) {
    return <div className={styles.container}><p>Error fetching profile: {error}</p></div>;
  }

  if (!profile) {
    return <div className={styles.container}><p>No profile found.</p></div>;
  }

  const { user } = profile;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        {/* ... sidebar icons ... */}
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>Back</button>
        {/* Top Right User */}
        <div className={styles.topBar}>
          <span className={styles.username}>{user.first_name} {user.last_name}</span>
          <img
            src={profile.profile_picture || PaulStatamImage}
            alt={`${user.first_name} ${user.last_name}`}
            className={styles.topAvatar}
          />
        </div>

        {/* Banner */}
        <div className={styles.banner}>
          <div className={styles.bannerItem}> <img src={Thornimage} alt="banner 1" /> </div>
          <div className={styles.bannerItem}> <img src={Thornimage} alt="banner 2" /> </div>
          <div className={styles.bannerItem}> <img src={Thornimage} alt="banner 3" /> </div>
          <div className={styles.bannerItem}> <img src={Thornimage} alt="banner 4" /> </div>
        </div>

        {/* Profile Avatar */}
        <div className={styles.profilePicWrapper}>
          <img
            src={profile.profile_picture || CircularFemaleImage}
            alt="Profile Avatar"
            className={styles.profilePic}
          />
          <CheckCircle className={styles.verifyBadge} />
        </div>

        {/* Profile Details */}
        <div className={styles.profileSection}>
          <div className={styles.profileBox}>
            <div className={styles.boxHeader}>
              <b>Name</b> {user.first_name} {user.last_name}
              <Link to="/organizerprofilesettings" className={styles.edit}>Edit</Link>
            </div>
            <p><b>Occupation</b><br />{profile.occupation || 'Not specified'}</p>
            <p><b>Email</b><br />{user.email}</p>
            <p><b>Interests</b><br />{profile.interests || 'Not specified'}</p>
            <p><b>Contact</b><br />{profile.phone_number || 'Not specified'}</p>
            <p><b>Address</b><br />{profile.address || 'Not specified'}</p>
          </div>

          <div className={styles.profileBox}>
            <p><b>Followers:</b></p>
            <p><b>Created Causes:</b></p>
            <p><b>Active Causes:</b></p>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>2025 <b>CauseHive.</b></div>
      </div>
    </div>
  );
};

export default OrganizerProfilePage;
