import { Switch, Route } from "react-router-dom";
import BuyRoutes from "../routes/BuyRoutes";
import AdminRoutes from "../routes/AdminRoutes";
import OrderRoutes from "../routes/OrderRoutes";
import Index from "../pages/Index";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import PageNotFound from "../pages/PageNotFound";
import PrivateRoute from "./PrivateRoute";

interface Props {}

const Routes: React.FC<Props> = () => {
  return (
    <>
      <Switch>
        <Route path="/buy">
          <PrivateRoute>
            <BuyRoutes />
          </PrivateRoute>
        </Route>
        <Route path="/orders">
          <PrivateRoute>
            <OrderRoutes />
          </PrivateRoute>
        </Route>
        <Route path="/admin">
          <PrivateRoute>
            <AdminRoutes />
          </PrivateRoute>
        </Route>
        <Route path="/products/:productId">
          <ProductDetail />
        </Route>
        <Route path="/products">
          <Products />
        </Route>
        <Route exact path="/">
          <Index />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </>
  );
};

export default Routes;
