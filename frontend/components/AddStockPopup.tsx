import React, { useState, useEffect } from 'react';
import { db } from './firebaseconfig'; // Adjust the path as needed
import { collection, addDoc } from 'firebase/firestore';
import styles from './addstockpopup.module.css';

interface AddStockPopupProps {
  onClose: () => void;
  onAddStock: (stock: any) => void;
  email: string;
}

const AddStockPopup: React.FC<AddStockPopupProps> = ({ onClose, onAddStock, email }) => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (searchTerm) {
      // Fetch stock names and prices from the Express API
      const fetchStocks = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/search?q=${searchTerm}`);
          const data = await response.json();
          setStocks(data);
        } catch (error) {
          console.error('Error fetching stock data:', error);
        }
      };

      fetchStocks();
    } else {
      setStocks([]);
    }
  }, [searchTerm]);

  const handleAddStock = async () => {
    if (selectedStock && quantity > 0) {
      // Fetch current value of the selected stock
      const fetchCurrentValue = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/stock?symbol=${selectedStock.symbol}`);
          const data = await response.json();
          const stockData = {
            name: selectedStock.name,
            symbol: selectedStock.symbol,
            quantity,
            price: data.price,
            totalValue: quantity * data.price,
            email,
          };

          // Store stock data in Firebase
          await addDoc(collection(db, 'userStocks'), stockData);

          onAddStock(stockData);
          onClose();
        } catch (error) {
          console.error('Error fetching current stock value:', error);
        }
      };

      fetchCurrentValue();
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>Add Stock</h2>
        <label>
          Search Stock:
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a stock"
          />
        </label>
        {stocks.length > 0 && (
          <ul className={styles.stockList}>
            {stocks.map((stock: any) => (
              <li
                key={stock.symbol}
                onClick={() => setSelectedStock(stock)}
                className={selectedStock?.symbol === stock.symbol ? styles.selected : ''}
              >
                {stock.name} ({stock.symbol})
              </li>
            ))}
          </ul>
        )}
        {selectedStock && (
          <div className={styles.stockDetails}>
            <p>Selected Stock: {selectedStock.name} ({selectedStock.symbol})</p>
          </div>
        )}
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>
        <button onClick={handleAddStock}>Add</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddStockPopup;