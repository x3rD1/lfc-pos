import { useContext, useEffect, useState, useRef, useCallback } from "react";
import styles from "./Menu.module.css";
import MenuContext from "../../contexts/MenuContext";
import OrderContext from "../../contexts/OrderContext";
import OrderCheck from "../../components/OrderCheck";
import { Media } from "../../components/Media";
import PlusOneAnimation from "../../components/PlusOneAnimation";

function Menu() {
  const { menu, fetchMenu, createOrderItem } = useContext(MenuContext);
  const { order } = useContext(OrderContext);
  const [showOrderCheck, setShowOrderCheck] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [animations, setAnimations] = useState([]);
  const itemRefs = useRef({});
  const animationIdRef = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const removeAnimation = useCallback((id) => {
    setAnimations((prev) => prev.filter((anim) => anim.id !== id));
  }, []);

  const handleCreateOrderItem = (itemId) => {
    if (isMobile && itemRefs.current[itemId]) {
      const rect = itemRefs.current[itemId].getBoundingClientRect();
      const newAnimation = {
        id: animationIdRef.current++,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      setAnimations((prev) => [...prev, newAnimation]);
      setCartPulse(true);
      setTimeout(() => setCartPulse(false), 200);
    }

    createOrderItem(itemId, order.id);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const cartItemCount =
    order?.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div
      className={`${styles.menuWrapper} ${isMobile ? styles.mobileMenuWrapper : ""}`}
    >
      {isMobile && showOrderCheck && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setShowOrderCheck(false)}
        />
      )}

      {isMobile &&
        animations.map((anim) => (
          <PlusOneAnimation
            key={anim.id}
            x={anim.x}
            y={anim.y}
            onComplete={() => removeAnimation(anim.id)}
          />
        ))}

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
              ref={(el) => {
                itemRefs.current[m.id] = el;
              }}
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

      {!isMobile && (
        <div className={styles.checkSection}>
          <OrderCheck />
        </div>
      )}

      {isMobile && (
        <button
          className={`${styles.floatingCartBtn} ${cartPulse ? styles.cartPulse : ""}`}
          onClick={() => setShowOrderCheck(true)}
        >
          <svg
            className={styles.cartIcon}
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
          {cartItemCount > 0 && (
            <span className={styles.cartBadge}>{cartItemCount}</span>
          )}
        </button>
      )}

      {isMobile && (
        <div
          className={`${styles.mobileOrderCheck} ${showOrderCheck ? styles.mobileOrderCheckOpen : ""}`}
        >
          <div className={styles.mobileOrderCheckHeader}>
            <button
              className={styles.closeOrderCheckBtn}
              onClick={() => setShowOrderCheck(false)}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <span className={styles.mobileOrderCheckTitle}>Your Order</span>
            <div className={styles.mobileOrderCheckSpacer} />
          </div>
          <div className={styles.mobileOrderCheckContent}>
            <div className={styles.mobileOrderCheckInner}>
              <OrderCheck />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
