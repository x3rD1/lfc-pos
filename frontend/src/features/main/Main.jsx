import { Outlet } from "react-router-dom";
import Navigation from "../navigation/Navigation";
import styles from "./Main.module.css";

function Main() {
  return (
    <div className={styles.mainWrapper}>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}

export default Main;
