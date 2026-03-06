import styles from "./OrderCard.module.css";

function OrderCard({ order, onComplete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const shortId = order.id.split("-")[0].toUpperCase();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.orderId}>Order #{shortId}</div>
      </div>

      <ul className={styles.itemsList}>
        {order.items.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.itemInfo}>
              <div className={styles.itemName}>{item.name_at_order}</div>
              <div className={styles.itemMeta}>
                Qty: {item.quantity} × {formatCurrency(item.price_at_order)}
              </div>
            </div>
            <div className={styles.itemPrice}>
              {formatCurrency(item.price_at_order * item.quantity)}
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total Amount</span>
          <span className={styles.totalAmount}>
            {formatCurrency(order.total)}
          </span>
        </div>

        <div className={styles.updatedAt}>
          Ordered on {formatDate(order.updatedAt)}
        </div>

        {order.status === "PAID" && (
          <button className={styles.completeButton} onClick={onComplete}>
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderCard;
