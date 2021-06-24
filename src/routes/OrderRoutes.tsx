import { Switch, Route, Redirect } from "react-router-dom";
import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import PageNotFound from "../pages/PageNotFound";
import { isClient } from "../helpers";
import { Role } from "../types";

interface Props {}

const OrderRoutes: React.FC<Props> = (props) => {
  const { userRole } = props as { userRole: Role | null };
  if (!isClient(userRole)) return <Redirect to="/" />;
  return (
    <Switch>
      <Route path="/orders/my-orders/:id">
        <OrderDetail />
      </Route>
      <Route path="/orders/my-orders">
        <Orders />
      </Route>
      <Route path="*">
        <PageNotFound />
      </Route>
    </Switch>
  );
};

export default OrderRoutes;
