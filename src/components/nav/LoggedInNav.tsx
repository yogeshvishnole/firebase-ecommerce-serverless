import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext, openUserDropDown } from "../../state/auth-context";
import { isClient } from "../../helpers";
import { useViewContext } from "../../state/view-context";

interface Props {}

const Navbar: React.FC<Props> = () => {
  const { viewMode } = useViewContext();
  const {
    authDispatch,
    authState: { userRole },
  } = useAuthContext();
  return (
    <ul className="navbar">
      <div className="navbar__lists">
        {(viewMode === "client" || isClient(userRole)) && (
          <li className="list list--cart">
            <NavLink to="/buy/my-cart">
              <FontAwesomeIcon
                icon={["fas", "cart-arrow-down"]}
                color="white"
                size="lg"
              />
            </NavLink>
            <div className="cart-qty">0</div>
          </li>
        )}
      </div>
      <div className="navbar__profile">
        <div className="profile">
          <FontAwesomeIcon
            icon={["fas", "user-circle"]}
            color="white"
            size="2x"
            onClick={() => authDispatch(openUserDropDown(true))}
          />
        </div>
      </div>
    </ul>
  );
};

export default Navbar;
