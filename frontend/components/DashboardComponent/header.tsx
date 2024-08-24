import React from "react";
import styles from "./header.module.css";
import logoImage from "./image 3.png";
import notiimage from "./icon_bell.png";
import profileimage from "./profile.png";
const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <img className={styles.logoImage} src={logoImage.src} alt="Logo" />

        <div className={styles.companyInfo}>
          <h1 className={styles.companyName}>Investlytic</h1>
          <p className={styles.tagline}>
            Empower Your Trades with Insightful Predictions
          </p>
        </div>
      </div>
      <div className={styles.headerRight}>
        <img className={styles.logoImage2} src={notiimage.src} alt="Logo" />
        <img className={styles.logoImage3} src={profileimage.src} alt="Logo" />
      </div>
    </header>
  );
};

export default Header;
