import { useContext, useEffect } from "react";
import OrderContext from "../contexts/OrderContext";
import MenuContext from "../contexts/MenuContext";
import styles from "../features/menu/Menu.module.css";

function OrderCheck() {
  const { order, createOrLoadOrder, updateOrderStatus } =
    useContext(OrderContext);
  const { orderItems, updateOrderItemQuantity } = useContext(MenuContext);

  const handleCreateOrder = () => {
    createOrLoadOrder();
  };

  const handlePay = (orderId) => {
    updateOrderStatus(orderId, "PAID");
  };

  const updateQuantity = (itemId, orderId) => {
    updateOrderItemQuantity(itemId, orderId);
  };

  const total =
    orderItems?.reduce((sum, item) => {
      return sum + item.price_at_order * item.quantity;
    }, 0) || 0;

  useEffect(() => {
    createOrLoadOrder();
  }, []);

  return (
    <div className={styles.checkSection}>
      <div className={styles.checkCard}>
        <div className={styles.checkHeader}>
          <div className={styles.checkTitle}>
            <svg
              className={styles.checkIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className={styles.orderNumber}>
              Order #{order?.id || "—"}
            </span>
          </div>
          <span
            className={`${styles.statusBadge} ${order?.id ? styles.statusActive : styles.statusInactive}`}
          >
            {order?.id ? "Active" : "No Order"}
          </span>
        </div>

        {order?.id ? (
          <div className={styles.checkContent}>
            <div className={styles.itemsList}>
              {orderItems?.map((item) => (
                <div key={item.id} className={styles.checkItem}>
                  <div className={styles.itemRow}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemNameCheck}>
                        {item.name_at_order}
                      </span>
                      <span className={styles.itemMeta}>
                        ${item.price_at_order.toFixed(2)} each
                      </span>
                    </div>
                    <div className={styles.itemControls}>
                      <span className={styles.quantityBadge}>
                        × {item.quantity}
                      </span>
                      <span className={styles.itemPriceCheck}>
                        ${(item.price_at_order * item.quantity).toFixed(2)}
                      </span>
                      <button
                        className={styles.removeBtn}
                        onClick={() => updateQuantity(item.itemId, order.id)}
                        title="Remove one"
                      >
                        <svg
                          className={styles.removeIcon}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {(!orderItems || orderItems.length === 0) && (
                <div className={styles.emptyItems}>
                  <svg
                    className={styles.emptyIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>Your cart is empty</span>
                  <span className={styles.emptyHint}>Click items to add</span>
                </div>
              )}
            </div>

            <div className={styles.checkFooter}>
              <div className={styles.totalSection}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Subtotal</span>
                  <span className={styles.totalAmount}>
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className={styles.totalLine}>
                  <span className={styles.grandTotal}>Total</span>
                  <span className={styles.grandTotalPrice}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                className={styles.payBtn}
                onClick={() => handlePay(order.id)}
                disabled={!orderItems || orderItems.length === 0}
              >
                <svg
                  className={styles.payIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Pay Now
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.emptyCheck}>
            <div className={styles.emptyState}>
              <svg
                className={styles.emptyStateIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className={styles.emptyTitle}>No Active Order</span>
              <span className={styles.emptySubtitle}>
                Create an order to start adding items
              </span>
            </div>
            <button
              onClick={handleCreateOrder}
              className={styles.createOrderBtn}
            >
              <svg
                className={styles.createIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderCheck;
