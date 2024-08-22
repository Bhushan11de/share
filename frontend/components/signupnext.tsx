import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from './firebaseconfig'; // Adjust the path as needed
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import AddStockPopup from './AddStockPopup';
import styles from './signupnext.module.css';

const SignupNext: React.FC = () => {
  const [name, setName] = useState('');
  const [stocks, setStocks] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name);
        }
      } else {
        router.push('/signin'); // Redirect to sign-in if no user is logged in
      }
    };

    const fetchUserStocks = async () => {
      const userStocksSnapshot = await getDocs(collection(db, 'userStocks'));
      const userStocks = userStocksSnapshot.docs.map(doc => doc.data());
      setStocks(userStocks);
    };

    fetchUserName();
    fetchUserStocks();
  }, [router]);

  const openAddStockPopup = () => {
    setShowPopup(true);
  };

  const closeAddStockPopup = () => {
    setShowPopup(false);
  };

  const handleAddStock = (stock: any) => {
    setStocks([...stocks, stock]);
  };

  return (
    <div className={styles.signin}>
      <div className={styles.signincont}>
        <div className={styles.signinside}>
          <h1 className={styles.welcomename}>Welcome, {name}!</h1>
          <p className={styles.textMain}>Insert your current Holdings</p>
          <table className={styles.tableMain}>
            <thead className={styles.headertable}>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Current Stock Rate</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.quantity}</td>
                  <td>{stock.price}</td>
                  <td>{stock.totalValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.addStock}>
            <div className={styles.addStockButton}>
              <button className={styles.stockbuttom} onClick={openAddStockPopup}>+ Add Stock</button>
            </div>
          </div>
          <div className={styles.addconfirmButton}>
            <button className={styles.confirmbuttom} onClick={openAddStockPopup}>Confirm</button>
          </div>
        </div>
      </div>
      {showPopup && <AddStockPopup onClose={closeAddStockPopup} onAddStock={handleAddStock} email={''} />}
    </div>
  );
};

export default SignupNext;