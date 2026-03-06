import { useContext, useEffect } from "react";
import OrderContext from "../../contexts/OrderContext";
import OrderCard from "./OrderCard";
import styles from "./Orders.module.css";

function Orders() {
  const { paidOrders, fetchPaidOrders, updateOrderStatus } =
    useContext(OrderContext);

  const handleComplete = (orderId) => {
    updateOrderStatus(orderId, "COMPLETED");
  };

  useEffect(() => {
    fetchPaidOrders();
  }, []);

  if (!paidOrders || paidOrders.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>☕</div>
          <h3>All caught up</h3>
          <p>No paid orders waiting</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Orders</h1>
        <span className={styles.badge}>{paidOrders.length}</span>
      </div>

      <div className={styles.grid}>
        {paidOrders.map((order, index) => (
          <div
            key={order.id}
            className={styles.cardWrapper}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <OrderCard
              order={order}
              onComplete={() => handleComplete(order.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
