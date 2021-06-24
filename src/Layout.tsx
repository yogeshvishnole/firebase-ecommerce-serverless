import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainNav from "./components/nav/MainNav";
import { useModalContext } from "./state/modal-context";
import UserDropDown from "./components/nav/UserDropDown";
import { openUserDropDown, useAuthContext } from "./state/auth-context";
import ViewContextProvider from "./state/view-context";

interface Props {}

const Layout: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const { modal } = useModalContext();
  const {
    authState: { isUserDropDownOpen },
    authDispatch,
  } = useAuthContext();

  useEffect(() => {
    if (isUserDropDownOpen) authDispatch(openUserDropDown(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <ViewContextProvider>
        <MainNav />
        {isUserDropDownOpen && <UserDropDown />}
      </ViewContextProvider>
      {modal && modal}
      <div className="page">{children}</div>
    </>
  );
};

export default Layout;
