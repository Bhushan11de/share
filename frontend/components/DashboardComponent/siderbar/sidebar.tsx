import React from "react";
import styles from "./sidebar.module.css";
import logoImage1 from "../assets/image 4.png";
import logoImage2 from "../assets/image 5.png";
import logoImage3 from "../assets/image 6.png";
import logoImage4 from "../assets/image 7.png";
import logoImage5 from "../assets/image 8.png";

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <div className={`${styles.menuItem} ${styles.active}`}>
        <img className={styles.logoImage} src={logoImage1.src} alt="Logo" />

        <span className={styles.menuText}>Portfolio</span>
      </div>
      <div className={styles.menuItem}>
        <img className={styles.logoImage} src={logoImage2.src} alt="Logo" />
        <span className={styles.menuText}>Forecasting</span>
      </div>
      <div className={styles.menuItem}>
        <img className={styles.logoImage} src={logoImage3.src} alt="Logo" />

        <span className={styles.menuText}>Recommend</span>
      </div>
      <div className={styles.menuItem}>
        <img className={styles.logoImage} src={logoImage4.src} alt="Logo" />

        <span className={styles.menuText}>Real-Time</span>
      </div>
      <div className={styles.menuItem}>
        <img className={styles.logoImage} src={logoImage5.src} alt="Logo" />

        <span className={styles.menuText}>Historic</span>
      </div>
    </div>
  );
};

export default Sidebar;
