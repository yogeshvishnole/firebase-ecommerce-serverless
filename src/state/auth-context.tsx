import {
  createContext,
  Dispatch,
  useReducer,
  useContext,
  useEffect,
} from "react";
import { auth } from "../firebase/config";

import { AuthUser, UserInfo, Role } from "../types/";
import { snapshotToUserInfo, usersRef } from "../firebase";

interface Props {}

type FETCH_AUTH_USER = { type: "FETCH_AUTH_USER"; payload: AuthUser | null };
type OPEN_USER_DROPDOWN = { type: "OPEN_USER_DROPDOWN"; payload: boolean };
type FETCH_USER_INFO = { type: "FETCH_USER_INFO"; payload: UserInfo | null };
type SIGNOUT_REDIRECT = { type: "SIGNOUT_REDIRECT"; payload: boolean };
type SET_USER_ROLE = { type: "SET_USER_ROLE"; payload: Role | null };
type FINISH_AUTH_CHECK = { type: "FINISH_AUTH_CHECK"; payload: boolean };

type AuthActions =
  | FETCH_AUTH_USER
  | OPEN_USER_DROPDOWN
  | FETCH_USER_INFO
  | SIGNOUT_REDIRECT
  | SET_USER_ROLE
  | FINISH_AUTH_CHECK;

type AuthState = {
  authUser: AuthUser | null;
  isUserDropDownOpen: boolean;
  userInfo: UserInfo | null;
  signoutRedirect: boolean;
  userRole: Role | null;
  authChecked: boolean;
};

type AuthDispatch = Dispatch<AuthActions>;

const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthDispatchContext = createContext<AuthDispatch | undefined>(undefined);

// Action Creator

export const fetchAuthUser = (user: AuthUser | null): FETCH_AUTH_USER => {
  return { type: "FETCH_AUTH_USER", payload: user };
};

export const openUserDropDown = (open: boolean): OPEN_USER_DROPDOWN => {
  return { type: "OPEN_USER_DROPDOWN", payload: open };
};

export const fetchUserInfo = (userInfo: UserInfo | null): FETCH_USER_INFO => {
  return { type: "FETCH_USER_INFO", payload: userInfo };
};

export const signoutRedirect = (redirect: boolean): SIGNOUT_REDIRECT => {
  return { type: "SIGNOUT_REDIRECT", payload: redirect };
};

export const setUserRole = (role: Role | null): SET_USER_ROLE => {
  return { type: "SET_USER_ROLE", payload: role };
};

export const finishAuthCheck = (checked: boolean): FINISH_AUTH_CHECK => {
  return { type: "FINISH_AUTH_CHECK", payload: checked };
};

// Reducer function
const authReducer = (state: AuthState, action: AuthActions): AuthState => {
  switch (action.type) {
    case "FETCH_AUTH_USER":
      return { ...state, authUser: action.payload };
    case "OPEN_USER_DROPDOWN":
      return { ...state, isUserDropDownOpen: action.payload };
    case "FETCH_USER_INFO":
      return { ...state, userInfo: action.payload };
    case "SIGNOUT_REDIRECT":
      return { ...state, signoutRedirect: action.payload };
    case "SET_USER_ROLE":
      return { ...state, userRole: action.payload };
    case "FINISH_AUTH_CHECK":
      return { ...state, authChecked: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  authUser: null,
  isUserDropDownOpen: false,
  userInfo: null,
  signoutRedirect: false,
  userRole: null,
  authChecked: false,
};

const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        user
          .getIdTokenResult()
          .then((result) => {
            const role = result.claims.role as Role;
            authDispatch(setUserRole(role));
          })
          .catch(() => authDispatch(setUserRole(null)));
        authDispatch(fetchAuthUser(user));
      } else {
        authDispatch(fetchAuthUser(null));
        authDispatch(setUserRole(null));
      }
      authDispatch(finishAuthCheck(true));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authState.authUser) {
      authDispatch(fetchUserInfo(null));
      return;
    }
    const unsubscribe = usersRef.doc(authState.authUser.uid).onSnapshot({
      next: (doc) => {
        if (!doc.exists) return authDispatch(fetchUserInfo(null));
        const userInfo = snapshotToUserInfo(doc);
        authDispatch(fetchUserInfo(userInfo));
      },
      error: () => {
        authDispatch(fetchUserInfo(null));
      },
    });
    return () => unsubscribe();
  }, [authState.authUser]);

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthDispatchContext.Provider value={authDispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => {
  const authState = useContext(AuthStateContext);
  const authDispatch = useContext(AuthDispatchContext);

  if (authState === undefined || authDispatch === undefined)
    throw new Error(
      "useAuthContext must be used within the AuthContextProvider"
    );

  return { authDispatch, authState };
};
