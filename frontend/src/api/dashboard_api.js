import { api } from "./client";

export const getMetrics = () => api.get("/api/dashboard/summary");
