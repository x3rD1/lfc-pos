import { useContext, useEffect, useState } from "react";
import TransactionContext from "./TransactionContext";
import { get_orders_by_date } from "../api/order_api";
import { urlFilteredByDate } from "../lib/urlFilteredByDate";

export function TransactionProvider({ children }) {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));

  const fetchCompletedOrders = async (targetDate = date) => {
    try {
      setDate(targetDate);
      const url = urlFilteredByDate("COMPLETED", targetDate);
      const res = await get_orders_by_date(url);
      setCompletedOrders(res);
    } catch (error) {
      console.error(error);
    }
  };

  const value = { completedOrders, fetchCompletedOrders, date };
  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
