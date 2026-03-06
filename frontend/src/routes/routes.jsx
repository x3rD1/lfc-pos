import ProtectedRoute from "./ProtectedRoute";
import Main from "../features/main/Main";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import Dashboard from "../features/dashboard/Dashboard";
import Menu from "../features/menu/Menu";
import Items from "../features/items/Items";
import Orders from "../features/orders/Orders";
import Transactions from "../features/transactions/Transactions";

const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Main />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "/menu", element: <Menu /> },
      { path: "/items", element: <Items /> },
      { path: "/orders", element: <Orders /> },
      { path: "/transactions", element: <Transactions /> },
    ],
  },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
];

export default routes;
