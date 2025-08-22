import React from "react"; 
import styles from "./styles.module.css";
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
  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <button className={styles.menuBtn} aria-label="Menu">☰</button>
        </div>
        <nav className={styles.nav} aria-label="Main">
          <button className={styles.navItem} aria-label="Dashboard"><Grid /></button>
          <button className={styles.navItem} aria-label="Favorites"><Heart /></button>
          <button className={styles.navItem} aria-label="Messages"><MessageSquare /></button>
          <button className={styles.navItem} aria-label="Layers"><Layers /></button>
          <button className={styles.navItem} aria-label="Calendar"><Calendar /></button>
        </nav>
        <div className={styles.sidebarBottom}>
          <button className={styles.navItem} aria-label="Profile"><User /></button>
          <button className={styles.navItem} aria-label="Settings"><Settings /></button>
          <button className={styles.navItem} aria-label="Logout"><LogOut /></button>
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
          <div className={styles.iconWrapper} aria-label="Cart">
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
              <div className={styles.causeCard}></div>
              <div className={styles.causeCard}></div>
              <div className={styles.causeCard}></div>
            </div>
          </div>
        </section>

        <section className={styles.recentDonations}>
          <h3>Your recent donations</h3>
          <div className={styles.donationsRow}>
            <div className={styles.donationCard}></div>
            <div className={styles.donationCard}></div>
            <div className={styles.donationCard}></div>
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
              <tr>
                <td className={styles.tableCause}>
                  <span className={styles.causeIcon}>⌂</span>
                  Apple Watch
                </td>
                <td>6096 Marjolaine Landing</td>
                <td>12.09.2019 - 12.53 PM</td>
                <td>Healthcare</td>
                <td>$34,295</td>
                <td><span className={styles.status}>Ongoing</span></td>
              </tr>
              {/* add more rows as needed */}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
