import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { getMe } from "../api/auth_api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    getMe()
      .then((res) => setUser(res))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    refreshUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
