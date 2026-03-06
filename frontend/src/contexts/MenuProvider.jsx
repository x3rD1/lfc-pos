import MenuContext from "./MenuContext";
import { getItems } from "../api/items_api";
import { useState } from "react";
import {
  create_order_item,
  update_order_item_quantity,
} from "../api/order_item_api";

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState([]);
  const [orderItems, setOrderItems] = useState([]);

  const fetchMenu = async () => {
    try {
      const res = await getItems();
      setMenu(res);
    } catch (error) {
      console.error(error);
    }
  };

  const createOrderItem = async (itemId, orderId) => {
    if (!orderId) return;
    try {
      const res = await create_order_item({ itemId, orderId });

      setOrderItems((prev) => {
        const exists = prev?.some((item) => item.itemId === itemId);

        if (exists) {
          return prev.map((item) => (item.itemId === itemId ? res : item));
        }

        return [...prev, res];
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateOrderItemQuantity = async (itemId, orderId) => {
    try {
      const res = await update_order_item_quantity(itemId, { orderId });
      setOrderItems((prev) => {
        if (res.deleted) {
          return prev.filter((item) => item.itemId !== res.itemId);
        }

        return prev.map((item) => (item.itemId === res.itemId ? res : item));
      });
    } catch (error) {
      console.error(error);
    }
  };

  const value = {
    menu,
    fetchMenu,
    orderItems,
    setOrderItems,
    createOrderItem,
    updateOrderItemQuantity,
  };
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}
