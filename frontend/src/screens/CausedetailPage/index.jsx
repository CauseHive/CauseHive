import styles from './styles.module.css';
import {
  FaBars,
  FaTachometerAlt,
  FaHeart,
  FaInbox,
  FaListAlt,
  FaCalendarAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaShoppingCart,
} from 'react-icons/fa';

const CausedetailPage = () => {
  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarItem}><FaBars /><span>Menu</span></div>
        <div className={styles.sidebarItem}><FaTachometerAlt /><span>Dashboard</span></div>
        <div className={styles.sidebarItem}><FaHeart /><span>Favorites</span></div>
        <div className={styles.sidebarItem}><FaInbox /><span>Inbox</span></div>
        <div className={styles.sidebarItem}><FaListAlt /><span>Order Lists</span></div>
        <div className={styles.sidebarItem}><FaCalendarAlt /><span>Calendar</span></div>
        <div className={styles.sidebarItem}><FaUser /><span>Profile</span></div>
        <div className={styles.sidebarItem}><FaCog /><span>Settings</span></div>
        <div className={styles.sidebarItem}><FaSignOutAlt /><span>Logout</span></div>
      </aside>

      {/* Main Content */}
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.logo}>CauseHive.</h1>
          <div className={styles.searchWrapper}>
            <input type="text" placeholder="Search..." className={styles.searchInput} />
            <div className={styles.cartIcon}>
              <FaShoppingCart />
              <span className={styles.cartBadge}>2</span>
            </div>
          </div>
        </header>

        {/* Main Section */}
        <main className={styles.main}>
          <h2 className={styles.sectionTitle}>Details</h2>
          <h3 className={styles.campaignTitle}>
            SpringLife Donation campaign: Seeking to restore humanity.
          </h3>

          {/* Placeholder Boxes */}
          <div className={styles.placeholders}>
            <div className={styles.box}></div>
            <div className={styles.box}></div>
            <div className={styles.box}></div>
          </div>

          {/* Info Section */}
          <div className={styles.infoGrid}>
            <div className={styles.infoBlock}>
              <h4>Created by:</h4>
              <p>Init dolor dot ereieum</p>
            </div>
            <div className={styles.infoBlock}>
              <h4>Description:</h4>
              <p>
                Rewrite the narrative, save lives and people. Restore balance. Create homes and
                narratives.
              </p>
            </div>
            <div className={styles.infoBlock}>
              <h4>Category:</h4>
              <p>Environment</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className={styles.progressContainer}>
            <label>Progress: 70% reached</label>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.buttonGroup}>
            <button className={styles.donateBtn}>Donate</button>
            <button className={styles.cartBtn}>Add to Cart</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CausedetailPage;
