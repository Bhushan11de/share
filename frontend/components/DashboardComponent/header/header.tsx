import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import styles from "./header.module.css";
import logoImage from "../assets/image 3.png";
import notiimage from "../assets/icon_bell.png";
import profileimage from "../assets/profile.png";

const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        router.push("/signin"); // Redirect to the sign-in page
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

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
        <img
          className={styles.logoImage2}
          src={notiimage.src}
          alt="Notification"
        />
        <img
          className={styles.logoImage3}
          src={profileimage.src}
          alt="Profile"
        />
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
