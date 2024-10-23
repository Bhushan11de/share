import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig"; // Adjust the path as needed
import styles from "./recommendations.module.css";
import { log } from "console";

const Recommendations: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stocks, setStocks] = useState<{ symbol: string; quantity: number }[]>(
    []
  );
  const [recommendations, setRecommendations] = useState<any[]>([]);
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
      console.log(stocksList);
    } catch (error) {
      console.error("Error fetching user stocks:", error);
    }
  };

  const handleGetRecommendations = async () => {
    if (stocks.length > 0) {
      setIsLoading(true);
      try {
        const portfolio = stocks.reduce((acc, stock) => {
          acc[stock.symbol] = stock.quantity;
          return acc;
        }, {} as { [key: string]: number });

        const response = await fetch("http://localhost:5000/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ portfolio }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>Stock Recommendations</h1>
      <button
        className={styles.button}
        onClick={handleGetRecommendations}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Get Recommendations"}
      </button>
      {recommendations.length > 0 && (
        <div className={styles.recommendations}>
          {recommendations.map((rec, index) => (
            <div key={index} className={styles.recommendation}>
              <p>Day: {rec.day}</p>
              <p>Action: {rec.action}</p>
              {rec.stock && <p>Stock: {rec.stock}</p>}
              {rec.quantity !== undefined && <p>Quantity: {rec.quantity}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
