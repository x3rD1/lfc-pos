import { useContext, useState } from "react";
import OrderContext from "./OrderContext";
import { create_order, get_orders, update_status } from "../api/order_api";
import MenuContext from "./MenuContext";

export function OrderProvider({ children }) {
  const { setOrderItems } = useContext(MenuContext);
  const [order, setOrder] = useState(null);
  const [paidOrders, setPaidOrders] = useState([]);

  const fetchPaidOrders = async () => {
    try {
      const res = await get_orders("PAID");
      setPaidOrders(res);
    } catch (error) {
      console.error(error);
    }
  };

  const createOrLoadOrder = async () => {
    try {
      const res = await create_order();
      setOrder(res);
      setOrderItems(res.items);
    } catch (error) {
      console.error(error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setOrderItems([]);
    try {
      await update_status(orderId, { status });
      setOrder(null);

      if (status === "COMPLETED") {
        setPaidOrders((prev) => prev.filter((item) => item.id !== orderId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const value = {
    order,
    paidOrders,
    fetchPaidOrders,
    createOrLoadOrder,
    updateOrderStatus,
  };
  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}
