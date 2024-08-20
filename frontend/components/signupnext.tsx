import React from 'react';
import styles from './signupnext.module.css';

const SignupNext: React.FC = () => {
  const openAddStockPopup = () => {
    // Implement the function to open the Add Stock popup
  };

  return (
    <div className={styles.signin}>
      <div className={styles.signincont}>
        <div className={styles.signinside}>
          <p className={styles.textMain}>Insert your current Holdings</p>
          <table className={styles.tableMain}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Current Stock Rate</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div className={styles.addStock}>
            <div className={styles.addStockButton}>
              <button
                className={styles.addstockbtn}
                id="addstockbtn"
                title="Add Stock"
                onClick={openAddStockPopup}
              >
                Add Stock
              </button>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.totalValueText}>Total Value -</p>
            </div>
          </div>
          <div className={styles.confirmStock}>
            <div className={styles.confirmStockButton}>
              <button
                className={styles.confirmstockbtn}
                id="confirmstockbtn"
                title="Confirm Stock"
              >
                Confirm &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupNext;