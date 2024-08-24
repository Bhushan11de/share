import { useState } from 'react';
import axios from 'axios';

const StockSearch = () => {
  const [query, setQuery] = useState('');
  const [stocks, setStocks] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/search?q=${query}`);
      setStocks(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for stocks"
      />
      <button onClick={handleSearch}>Search</button>
      {showPopup && (
        <div className="popup">
          <button onClick={() => setShowPopup(false)}>Close</button>
          <ul>
            {stocks.map((stock, index) => (
              <li key={index}>
                {stock.name} ({stock.symbol}) - {stock.region}
              </li>
            ))}
          </ul>
        </div>
      )}
      <style jsx>{`
        .popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default StockSearch;