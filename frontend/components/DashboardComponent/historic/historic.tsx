import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig"; // Adjust the path as needed
import Chart from "chart.js/auto";
import styles from "./historic.module.css";

const HistoricData: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stocks, setStocks] = useState<{ symbol: string; quantity: number }[]>(
    []
  );
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("1mo");
  const [historicData, setHistoricData] = useState<{
    dates: string[];
    prices: number[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

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
    } catch (error) {
      console.error("Error fetching user stocks:", error);
    }
  };

  const handleFetchHistoricData = async () => {
    if (selectedStock) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/historic?symbol=${selectedStock}&range=${timeRange}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setHistoricData(data);
      } catch (error) {
        console.error("Error fetching historic data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (historicData && chartRef.current) {
      displayChart(historicData);
    }
  }, [historicData]);

  const displayChart = (data: { dates: string[]; prices: number[] }) => {
    const ctx = chartRef.current?.getContext("2d");
    if (ctx) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const minPrice = Math.min(...data.prices);
      const maxPrice = Math.max(...data.prices);

      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: data.dates,
          datasets: [
            {
              label: "Historic Prices",
              data: data.prices,
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              min: minPrice,
              max: maxPrice,
            },
          },
        },
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1>Historic Stock Data</h1>
      <select
        className={styles.select}
        value={selectedStock || ""}
        onChange={(e) => setSelectedStock(e.target.value)}
      >
        <option value="" disabled>
          Select a stock
        </option>
        {stocks.map((stock) => (
          <option key={stock.symbol} value={stock.symbol}>
            {stock.symbol}
          </option>
        ))}
      </select>
      <select
        className={styles.select}
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
      >
        <option value="1wk">5 Days</option>
        <option value="1mo">1 Month</option>
        <option value="1y">1 Year</option>
        <option value="5y">5 Years</option>
      </select>
      <button
        className={styles.button}
        onClick={handleFetchHistoricData}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Fetch Data"}
      </button>
      {historicData && (
        <div className={styles["canvas-container"]}>
          <canvas
            ref={chartRef}
            id="historicChart"
            width="400"
            height="200"
          ></canvas>
        </div>
      )}
    </div>
  );
};

export default HistoricData;
