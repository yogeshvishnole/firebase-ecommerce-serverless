import {
  openUserDropDown,
  signoutRedirect,
  useAuthContext,
} from "../../state/auth-context";
import Button from "../Button";
import ClientDropDown from "./ClientDropDown";
import AdminDropDown from "./AdminDropDown";
import { useAuthenticate } from "../../hooks/useAuthenticate";
import { isClient, isAdmin } from "../../helpers";
import { useViewContext } from "../../state/view-context";

interface Props {}

const UserDropDown: React.FC<Props> = () => {
  const { viewMode } = useViewContext();
  const {
    authState: { authUser, userRole },
    authDispatch,
  } = useAuthContext();

  const { signout } = useAuthenticate();

  return (
    <div className="page page--sidebar">
      <div className="sidebar sidebar-show">
        <div className="sidebar__section sidebar__section--profile">
          <h3 className="header--center header--sidebar">
            {authUser?.displayName}
          </h3>
          <h3 className="header--center header--sidebar">{authUser?.email}</h3>
        </div>

        {isAdmin(userRole) && <AdminDropDown />}
        {(isClient(userRole) ||
          (isAdmin(userRole) && viewMode === "client")) && <ClientDropDown />}

        {/* Logout */}
        <div className="sidebar__section">
          <Button
            className="btn--sidebar-signout"
            onClick={() => {
              signout();
              authDispatch(signoutRedirect(true));
            }}
          >
            SIGNOUT
          </Button>
        </div>

        {/* Close sidebar */}
        <div className="sidebar__section">
          <Button
            className="sidebar__close"
            onClick={() => authDispatch(openUserDropDown(false))}
          >
            &times;
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDropDown;
