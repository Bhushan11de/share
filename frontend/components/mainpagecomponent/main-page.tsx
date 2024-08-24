import React from 'react';
import logoImage from "./image3.png";
import styles from './main-page.module.css'; // Import the CSS Module

const MainPage: React.FC = () => {
    return (
        <div className={styles.logocontainer}>
            <div className={styles.imagescreen}>
                <div className={styles.marginscreen}>
                    <img className={styles.logoImage} src={logoImage.src} alt="Logo" />
                    <div className={styles.companyName}>Investlytic</div>
                    <div className={styles.companyTagline}>
                        Empower Your Trades with Insightful Predictions
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;