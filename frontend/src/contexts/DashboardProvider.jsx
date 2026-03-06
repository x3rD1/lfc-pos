import { useState } from "react";
import DashboardContext from "./DashboardContext";
import { getMetrics } from "../api/dashboard_api";

function DashboardProvider({ children }) {
  const [metrics, setMetrics] = useState([]);

  const fetchMetrics = async () => {
    try {
      const res = await getMetrics();
      setMetrics(res);
    } catch (error) {
      console.error(error);
    }
  };

  const value = { metrics, fetchMetrics };
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export default DashboardProvider;
