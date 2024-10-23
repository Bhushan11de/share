import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig"; // Adjust the path as needed
import styles from "./realtime.module.css";

const RealTimeData: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stocks, setStocks] = useState<{ symbol: string; quantity: number }[]>(
    []
  );
  const [realTimeData, setRealTimeData] = useState<
    { symbol: string; price: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        fetchUserStocks(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserStocks = async (email: string) => {
    try {
      const stocksCollection = collection(db, "userstocks", email, "stocks");
      const stocksSnapshot = await getDocs(stocksCollection);
      const stocksList = stocksSnapshot.docs.map(
        (doc) => doc.data() as { symbol: string; quantity: number }
      );
      setStocks(stocksList);
      fetchRealTimeData(stocksList);
    } catch (error) {
      console.error("Error fetching user stocks:", error);
    }
  };

  const fetchRealTimeData = async (
    stocks: { symbol: string; quantity: number }[]
  ) => {
    setIsLoading(true);
    try {
      const realTimeDataPromises = stocks.map(async (stock) => {
        const response = await fetch(
          `http://localhost:3001/api/stock?symbol=${stock.symbol}`
        );
        const data = await response.json();
        return { symbol: stock.symbol, price: data.regularMarketPrice };
      });

      const realTimeData = await Promise.all(realTimeDataPromises);
      setRealTimeData(realTimeData);
    } catch (error) {
      console.error("Error fetching real-time data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Real-Time Stock Data</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Current Price</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const realTimeStock = realTimeData.find(
                (data) => data.symbol === stock.symbol
              );
              return (
                <tr key={stock.symbol}>
                  <td>{stock.symbol}</td>
                  <td>{stock.quantity}</td>
                  <td>
                    {realTimeStock
                      ? `$${realTimeStock.price.toFixed(2)}`
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RealTimeData;
