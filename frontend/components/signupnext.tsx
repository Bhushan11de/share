import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "./firebaseconfig"; // Adjust the path as needed
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import AddStockPopup from "./AddStockPopup";
import styles from "./signupnext.module.css";

const SignupNext: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState<string | null>("");
  const [stocks, setStocks] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5); // Number of rows per page
  const router = useRouter();

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name);
          setEmail(user.email);
        }
      } else {
        router.push("/signin"); // Redirect to sign-in if no user is logged in
      }
    };

    const fetchUserStocks = async () => {
      if (email) {
        const userStocksSnapshot = await getDocs(
          collection(db, `userstocks/${email}/stocks`)
        );
        const userStocks = userStocksSnapshot.docs.map((doc) => doc.data());
        setStocks(userStocks);
      }
    };

    fetchUserName();
    fetchUserStocks();
  }, [router, email]);

  useEffect(() => {
    const fetchStockPrices = async () => {
      const updatedStocks = await Promise.all(
        stocks.map(async (stock) => {
          try {
            const response = await fetch(
              `http://localhost:3001/api/stock?symbol=${stock.symbol}`
            );
            const data = await response.json();
            return {
              ...stock,
              price: data.price,
              totalValue: stock.quantity * data.price,
            };
          } catch (error) {
            console.error("Error fetching stock price:", error);
            return stock;
          }
        })
      );
      setStocks(updatedStocks);
    };

    if (stocks.length > 0) {
      fetchStockPrices();
    }
  }, [stocks]);

  const openAddStockPopup = () => {
    setShowPopup(true);
  };

  const closeAddStockPopup = () => {
    setShowPopup(false);
  };

  const handleAddStock = (stock: any) => {
    setStocks([...stocks, stock]);
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = stocks.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(stocks.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleConfirm = () => {
    router.push("/dashboard");
  };

  return (
    <div className={styles.signin}>
      <div className={styles.signincont}>
        <div className={styles.signinside}>
          <h1 className={styles.welcomename}>Welcome, {name}!</h1>
          <p className={styles.textMain}>Insert your current Holdings</p>
          <div className={styles.tableMain}>
            <table className={styles.table}>
              <thead className={styles.headertable}>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Current Stock Rate</th>
                  <th>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((stock, index) => (
                  <tr key={index}>
                    <td>{stock.name}</td>
                    <td>{stock.quantity}</td>
                    <td>
                      {stock.price !== undefined ? stock.price : "Loading..."}
                    </td>
                    <td>
                      {stock.totalValue !== undefined
                        ? stock.totalValue
                        : "Loading..."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.pagination}>
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          <div className={styles.addStock}>
            <div className={styles.addStockButton}>
              <button
                className={styles.stockbuttom}
                onClick={openAddStockPopup}
              >
                + Add Stock
              </button>
            </div>
          </div>
          <div className={styles.addconfirmButton}>
            <button className={styles.confirmbuttom} onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
      {showPopup && (
        <AddStockPopup
          onClose={closeAddStockPopup}
          onAddStock={handleAddStock}
          email={email}
        />
      )}
    </div>
  );
};

export default SignupNext;
