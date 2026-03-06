import { api } from "./client";

export const getItems = () => api.get("/api/items");
export const createItem = (data) => api.post("/api/items", data);
export const updateItem = (data, itemId) =>
  api.patch(`/api/items/${itemId}`, data);
export const deleteItem = (itemId) => api.delete(`/api/items/${itemId}`);
