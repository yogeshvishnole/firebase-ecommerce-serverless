import { Switch, Route, Redirect } from "react-router-dom";
import ManageOrders from "../pages/ManageOrders";
import ManageProducts from "../pages/ManageProducts";
import ManageUsers from "../pages/ManageUsers";
import ManageOrderDetail from "../pages/ManageOrderDetail";
import { isAdmin } from "../helpers";
import { Role } from "../types";

interface Props {}

const AdminRoutes: React.FC<Props> = (props) => {
  const { userRole } = props as { userRole: Role | null };
  if (!isAdmin(userRole)) return <Redirect to="/buy/my-cart" />;
  return (
    <Switch>
      <Route path="/admin/manage-products">
        <ManageProducts />
      </Route>
      <Route path="/admin/manage-orders/:id">
        <ManageOrderDetail />
      </Route>
      <Route path="/admin/manage-orders">
        <ManageOrders />
      </Route>
      <Route path="/admin/manage-users">
        <ManageUsers />
      </Route>
    </Switch>
  );
};

export default AdminRoutes;
