import React, { useState, useEffect } from "react";
import { db } from "../firebaseconfig"; // Adjust the path as needed
import { doc, setDoc } from "firebase/firestore";
import styles from "./addstockpopup.module.css";

interface AddStockPopupProps {
  onClose: () => void;
  onAddStock: (stock: any) => void;
  email: string | null;
}

const AddStockPopup: React.FC<AddStockPopupProps> = ({
  onClose,
  onAddStock,
  email,
}) => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState<number | null>(null);
  const [totalValue, setTotalValue] = useState<number | null>(null);

  useEffect(() => {
    if (searchTerm) {
      // Fetch stock names and prices from the Express API
      const fetchStocks = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/search?q=${searchTerm}`
          );
          const data = await response.json();
          setStocks(data);
        } catch (error) {
          console.error("Error fetching stock data:", error);
        }
      };

      fetchStocks();
    } else {
      setStocks([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (selectedStock) {
      // Fetch the current price of the selected stock
      const fetchStockPrice = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/stock?symbol=${selectedStock.symbol}`
          );
          const data = await response.json();
          setPrice(data.price);
          setTotalValue(quantity * data.price);
        } catch (error) {
          console.error("Error fetching stock price:", error);
        }
      };

      fetchStockPrice();
    }
  }, [selectedStock, quantity]);

  const handleAddStock = async () => {
    if (selectedStock && quantity > 0 && email) {
      try {
        const stockData = {
          name: selectedStock.name,
          symbol: selectedStock.symbol,
          quantity,
          price,
          totalValue,
        };

        // Store stock data in Firebase under userstocks/{email}/stocks/{stock symbol}
        await setDoc(
          doc(db, `userstocks/${email}/stocks`, selectedStock.symbol),
          stockData
        );

        onAddStock(stockData);
        onClose();
      } catch (error) {
        console.error("Error adding stock to Firestore:", error);
      }
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>Add Stock</h2>
        <label>
          Search Stock:
          <input
            className={styles.inputfield}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a stock"
          />
        </label>
        {!selectedStock && stocks.length > 0 && (
          <ul className={styles.stockList}>
            {stocks.map((stock: any, index: number) => (
              <li
                key={`${stock.symbol}-${index}`}
                onClick={() => setSelectedStock(stock)}
                className={
                  selectedStock?.symbol === stock.symbol ? styles.selected : ""
                }
              >
                {stock.name} ({stock.symbol})
              </li>
            ))}
          </ul>
        )}
        {selectedStock && (
          <div className={styles.stockDetails}>
            <p>
              Selected Stock: {selectedStock.name} ({selectedStock.symbol})
            </p>
            <label>
              Quantity:
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>
            <p>
              Current Price: {price !== null ? price.toFixed(2) : "Loading..."}
            </p>
            <p>
              Total Value:{" "}
              {totalValue !== null ? totalValue.toFixed(2) : "Loading..."}
            </p>
          </div>
        )}
        <button onClick={handleAddStock}>Add</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddStockPopup;
