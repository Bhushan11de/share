import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig"; // Adjust the path as needed
import AddStockPopup from "../../signupnextcomponent/AddStockPopup"; // Adjust the path as needed
import StockDetailsPopup from "./StockDetailsPopup"; // Adjust the path as needed
import styles from "./portfolio.module.css"; // Adjust the path as needed
import SellStockPopup from "./SellStockPopup";
const Portfolio: React.FC = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isDetailsPopupVisible, setIsDetailsPopupVisible] = useState(false);
  const [isSellPopupVisible, setIsSellPopupVisible] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [stocks, setStocks] = useState<any[]>([]); // State to store the list of stocks
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // State to handle loading

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        } else {
          console.log("No such document!");
        }
        if (user.email) {
          setUserEmail(user.email);
          fetchUserStocks(user.email);
        }
      } else {
        console.log("User is not signed in");
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserStocks = async (email: string) => {
    setIsLoading(true);
    try {
      const stocksCollection = collection(db, "userstocks", email, "stocks");
      const stocksSnapshot = await getDocs(stocksCollection);
      const stocksList = stocksSnapshot.docs.map((doc) => doc.data());
      setStocks(stocksList);
    } catch (error) {
      console.error("Error fetching user stocks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStockPrices = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const prices = await Promise.all(
        stocks.map(async (stock) => {
          const response = await fetch(
            `http://localhost:3001/api/stock?symbol=${stock.symbol}`
          );
          const data = await response.json();
          console.log(
            `Fetched price for ${stock.symbol}:`,
            data.regularMarketPrice
          );
          return { ...stock, price: data.regularMarketPrice };
        })
      );
      setStocks(prices);
      const total = prices.reduce(
        (acc, stock) => acc + stock.price * stock.quantity,
        0
      );
      setTotalValue(total);
    } catch (error) {
      console.error("Error fetching stock prices:", error);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  useEffect(() => {
    if (stocks.length > 0) {
      fetchStockPrices();
    } else {
      setTotalValue(null);
    }
  }, [stocks.length]);

  const handleButtonClick = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleAddStock = (stock: any) => {
    setStocks((prevStocks) => [...prevStocks, stock]);
  };

  const handleOpenDetails = () => {
    setIsDetailsPopupVisible(true);
  };

  const handleCloseDetailsPopup = () => {
    setIsDetailsPopupVisible(false);
  };

  const handleSellButtonClick = () => {
    setIsSellPopupVisible(true);
  };

  const handleCloseSellPopup = () => {
    setIsSellPopupVisible(false);
  };

  const handleSellStock = (symbol: string, quantity: number) => {
    setStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.symbol === symbol
          ? { ...stock, quantity: stock.quantity - quantity }
          : stock
      )
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Hey {userName ? userName : "Loading..."}</h1>
        <h3>
          Total Asset Value:{" "}
          {isLoading
            ? "Loading..."
            : totalValue !== null
            ? `$${totalValue.toFixed(2)}`
            : "N/A"}
        </h3>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleOpenDetails}>
          Open Full Details
        </button>
        <button className={styles.button} onClick={handleButtonClick}>
          Add Stock
        </button>
        <button className={styles.button} onClick={handleSellButtonClick}>
          Sell Stock
        </button>
      </div>
      {isPopupVisible && userEmail && (
        <AddStockPopup
          onClose={handleClosePopup}
          onAddStock={handleAddStock}
          email={userEmail}
        />
      )}
      {isDetailsPopupVisible && (
        <StockDetailsPopup
          onClose={handleCloseDetailsPopup}
          stocks={stocks}
          totalValue={totalValue || 0}
        />
      )}
      {isSellPopupVisible && userEmail && (
        <SellStockPopup
          onClose={handleCloseSellPopup}
          email={userEmail}
          stocks={stocks}
          onSellStock={handleSellStock}
        />
      )}
    </div>
  );
};

export default Portfolio;
