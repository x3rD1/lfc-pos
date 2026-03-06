import { api } from "./client";

export const get_orders = (status) => api.get(`/api/orders?status=${status}`);
export const get_orders_by_date = (url) => api.get(url);
export const create_order = (data = {}) => api.post("/api/orders", data);
export const update_status = (orderId, data) =>
  api.patch(`/api/orders/${orderId}`, data);
