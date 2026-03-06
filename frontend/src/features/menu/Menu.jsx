import { useContext, useEffect } from "react";
import styles from "./Menu.module.css";
import MenuContext from "../../contexts/MenuContext";
import OrderContext from "../../contexts/OrderContext";
import OrderCheck from "../../components/OrderCheck";

export function Media({ url, type }) {
  if (!url) return null;

  const optimizedUrl = url.replace(
    "/upload/",
    "/upload/w_auto,c_limit,q_auto,f_auto/",
  );

  if (type === "image") {
    return <img src={optimizedUrl} loading="lazy" alt="" />;
  }

  return null;
}

function Menu() {
  const { menu, fetchMenu, createOrderItem } = useContext(MenuContext);
  const { order } = useContext(OrderContext);

  const handleCreateOrderItem = (itemId) => {
    createOrderItem(itemId, order.id);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div className={styles.menuWrapper}>
      <div className={styles.menuSection}>
        <div className={styles.menuHeader}>
          <h1 className={styles.menuTitle}>Menu</h1>
          <p className={styles.menuSubtitle}>
            Select items to add to the order
          </p>
        </div>
        <div className={styles.menuGrid}>
          {menu.map((m) => (
            <div
              className={styles.menuCard}
              onClick={() => handleCreateOrderItem(m.id)}
              key={m.id}
            >
              <div className={styles.imageContainer}>
                {m.mediaUrl ? (
                  <div className={styles.image}>
                    <Media url={m.mediaUrl} type={"image"} />
                  </div>
                ) : (
                  <div className={styles.noImage}>
                    <svg
                      className={styles.noImageIcon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.itemName}>{m.name}</span>
                <span className={styles.itemPrice}>
                  ${m.price?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className={styles.addIndicator}>
                <svg
                  className={styles.addIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      <OrderCheck />
    </div>
  );
}

export default Menu;
