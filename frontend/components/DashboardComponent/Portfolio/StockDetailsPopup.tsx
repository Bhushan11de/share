import React from "react";
import styles from "./stockdetailspopup.module.css";

interface StockDetailsPopupProps {
  onClose: () => void;
  stocks: { symbol: string; quantity: number; price?: number }[];
  totalValue: number;
}

const StockDetailsPopup: React.FC<StockDetailsPopupProps> = ({
  onClose,
  stocks,
  totalValue,
}) => {
  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <button onClick={onClose} className={styles.closeButton}>
          X
        </button>
        <h2>Stock Details</h2>
        <table className={styles.stockTable}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.quantity}</td>
                <td>
                  {stock.price !== undefined
                    ? `$${stock.price.toFixed(2)}`
                    : "N/A"}
                </td>
                <td>
                  {stock.price !== undefined
                    ? `$${(stock.price * stock.quantity).toFixed(2)}`
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Total Portfolio Value: ${totalValue.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default StockDetailsPopup;
