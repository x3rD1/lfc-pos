import { useEffect } from "react";
import styles from "./PlusOneAnimation.module.css";

function PlusOneAnimation({ x, y, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={styles.plusOne} style={{ left: x, top: y }}>
      +1
    </div>
  );
}

export default PlusOneAnimation;
