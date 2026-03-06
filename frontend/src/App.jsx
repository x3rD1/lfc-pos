import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { ItemsProvider } from "./contexts/ItemsProvider";
import { MenuProvider } from "./contexts/MenuProvider";
import { OrderProvider } from "./contexts/OrderProvider";
import { TransactionProvider } from "./contexts/TransactionProvider";
import DashboardProvider from "./contexts/DashboardProvider";

import routes from "./routes/routes";

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <MenuProvider>
          <OrderProvider>
            <TransactionProvider>
              <ItemsProvider>
                <RouterProvider router={router} />
              </ItemsProvider>
            </TransactionProvider>
          </OrderProvider>
        </MenuProvider>
      </DashboardProvider>
    </AuthProvider>
  );
}

export default App;
