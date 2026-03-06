import { api } from "./client";

export const create_order_item = (data) => api.post("/api/order_item", data);
export const update_order_item_quantity = (itemId, data) =>
  api.patch(`/api/order_item/${itemId}`, data);
