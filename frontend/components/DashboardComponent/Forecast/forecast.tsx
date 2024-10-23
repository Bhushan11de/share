import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig"; // Adjust the path as needed
import Chart from "chart.js/auto";
import styles from "./forecast.module.css";

const Forecast: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stocks, setStocks] = useState<{ symbol: string; quantity: number }[]>(
    []
  );
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [forecastData, setForecastData] = useState<{
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

  const handleForecast = async () => {
    if (selectedStock) {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/forecast", {
          // Ensure the correct URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stock_symbol: selectedStock }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setForecastData(data);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (forecastData && chartRef.current) {
      displayChart(forecastData);
    }
  }, [forecastData]);

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
              label: "Forecasted Prices",
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
      <h1>Forecast Stock Prices</h1>
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
      <button
        className={styles.button}
        onClick={handleForecast}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Forecast"}
      </button>
      {forecastData && (
        <div className={styles["canvas-container"]}>
          <canvas
            ref={chartRef}
            id="forecastChart"
            width="400"
            height="200"
          ></canvas>
        </div>
      )}
    </div>
  );
};

export default Forecast;
