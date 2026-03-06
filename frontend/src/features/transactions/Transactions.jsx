import { useContext, useEffect, useRef } from "react";
import TransactionContext from "../../contexts/TransactionContext";
import { dateFormat } from "../../lib/dateFormat";
import OrderCard from "../orders/OrderCard";
import styles from "./Transactions.module.css";

function Transactions() {
  const { completedOrders, fetchCompletedOrders, date } =
    useContext(TransactionContext);
  const dateRef = useRef();

  const revenue = completedOrders
    ?.map((order) => order.total)
    .reduce((acc, curr) => acc + curr, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const pickDate = () => {
    dateRef.current.showPicker();
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.dateHeader}>
        <div className={styles.headerLeft}>
          <input
            ref={dateRef}
            type="date"
            value={date}
            onChange={(e) => fetchCompletedOrders(e.target.value)}
            style={{ display: "none" }}
          />
          <button className={styles.calendarBtn} onClick={pickDate}>
            📅
          </button>
          <span className={styles.dateText}>{dateFormat(date)}</span>
        </div>

        <div className={styles.revenue}>
          <span className={styles.revenueLabel}>Revenue</span>
          <span className={styles.revenueAmount}>
            {formatCurrency(revenue)}
          </span>
        </div>
      </div>

      <div className={styles.listContainer}>
        {completedOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h3>No transactions</h3>
            <p>No completed orders for this date</p>
          </div>
        ) : (
          completedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}

export default Transactions;
