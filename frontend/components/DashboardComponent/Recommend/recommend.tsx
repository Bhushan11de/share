import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import styles from "./recommendations.module.css";

const Recommendations: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stocks, setStocks] = useState<{ symbol: string; quantity: number }[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeDay, setActiveDay] = useState<number>(1);

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

  useEffect(() => {
    if (recommendations.length > 0) {
      filterRecommendations(activeFilter, activeDay);
    }
  }, [recommendations, activeFilter, activeDay]);

  const fetchUserStocks = async (email: string) => {
    try {
      const stocksCollection = collection(db, "userstocks", email, "stocks");
      const stocksSnapshot = await getDocs(stocksCollection);
      const stocksList = stocksSnapshot.docs.map(
        (doc) => doc.data() as { symbol: string; quantity: number }
      );
      setStocks(stocksList);
    } catch (error) {
      console.error("Error fetching user stocks:", error);
      setError("Failed to fetch user stocks. Please try again.");
    }
  };

  const filterRecommendations = (agentType: string, day: number) => {
    let filtered = recommendations.filter((rec) => rec.day === day);

    if (agentType !== "all") {
      filtered = filtered.filter((rec) => rec.agent === agentType);
    }

    setFilteredRecommendations(filtered);
  };

  const handleGetRecommendations = async () => {
    if (stocks.length > 0) {
      setIsLoading(true);
      setError(null);
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
          throw new Error("Failed to fetch recommendations. Please try again.");
        }

        const data = await response.json();
        setRecommendations(data);
        setActiveDay(1);
        setActiveFilter("all");
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setError("Failed to fetch recommendations. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("No stocks found in your portfolio.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Multi-Agent Stock Recommendations</h1>
      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.button}
        onClick={handleGetRecommendations}
        disabled={isLoading}
      >
        {isLoading ? "Generating Recommendations..." : "Get Agent Recommendations"}
      </button>

      {recommendations.length > 0 && (
        <div className={styles.recommendations}>
          <h2>Trading Recommendations for Next 5 Days</h2>

          <div className={styles.filters}>
            <div className={styles.dayFilters}>
              {[1, 2, 3, 4, 5].map((day) => (
                <button
                  key={day}
                  className={`${styles.dayButton} ${activeDay === day ? styles.activeDay : ""}`}
                  onClick={() => setActiveDay(day)}
                >
                  Day {day}
                </button>
              ))}
            </div>

            <div className={styles.agentFilters}>
              <button
                className={`${styles.filterButton} ${activeFilter === "all" ? styles.activeFilter : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All Agents
              </button>
              <button
                className={`${styles.filterButton} ${activeFilter === "conservative" ? styles.activeFilter : ""}`}
                onClick={() => setActiveFilter("conservative")}
              >
                Conservative
              </button>
              <button
                className={`${styles.filterButton} ${activeFilter === "moderate" ? styles.activeFilter : ""}`}
                onClick={() => setActiveFilter("moderate")}
              >
                Moderate
              </button>
              <button
                className={`${styles.filterButton} ${activeFilter === "aggressive" ? styles.activeFilter : ""}`}
                onClick={() => setActiveFilter("aggressive")}
              >
                Aggressive
              </button>
            </div>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Action</th>
                <th>Quantity</th>
                <th>Agent Model</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecommendations.length > 0 ? (
                filteredRecommendations.map((rec, index) => (
                  <tr key={index}>
                    <td>{rec.stock}</td>
                    <td className={rec.action === "sell" ? styles.sellAction : styles.holdAction}>
                      {rec.action.toUpperCase()}
                    </td>
                    <td>{rec.quantity !== undefined ? rec.quantity : "N/A"}</td>
                    <td>{rec.agent.charAt(0).toUpperCase() + rec.agent.slice(1)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={styles.noData}>
                    No recommendations match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
