import { useAsyncCall } from "./useAsyncCall";
import { SignupData, Provider } from "../types/";
import { auth, functions, firebase } from "../firebase/config";
import { openUserDropDown, useAuthContext } from "../state/auth-context";

export const useAuthenticate = () => {
  const {
    loading,
    setLoading,
    error,
    setError,
    successMsg,
    setSuccessMsg,
  } = useAsyncCall();
  const {
    authState: { isUserDropDownOpen },
    authDispatch,
  } = useAuthContext();

  const signup = async (data: SignupData) => {
    const { username, email, password } = data;
    setLoading(true);
    try {
      const response = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (!response) {
        setError("Something went wrong");
        setLoading(false);
        return;
      }

      // update the user display name in firebase authentication
      auth.currentUser?.updateProfile({
        displayName: username,
      });

      // call onSignup function to create a new user in firestore

      const onSignup = functions.httpsCallable("onSignup");

      const data = await onSignup({ username });

      setLoading(false);
      return data;
    } catch (err) {
      const { message } = err as { message: string };
      setError(message);
      setLoading(false);
    }
  };

  const signout = () => {
    auth
      .signOut()
      .then(() => {
        if (isUserDropDownOpen) authDispatch(openUserDropDown(false));
      })
      .catch(() => alert("Something went wrong"));
  };

  const signin = async (data: Omit<SignupData, "username">) => {
    setLoading(true);
    const { email, password } = data;
    try {
      const response = await auth.signInWithEmailAndPassword(email, password);
      if (!response) {
        setError("Something went wrong");
        setLoading(false);
        return;
      }
      setLoading(false);
      return response;
    } catch (err) {
      const { message } = err as { message: string };
      setError(message);
      setLoading(false);
    }
  };

  const resetPassword = (data: Omit<SignupData, "username" | "password">) => {
    const { email } = data;
    setLoading(true);
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setSuccessMsg("Please check your email to reset your password.");
        setLoading(false);
      })
      .catch((err) => {
        const { message } = err as { message: string };
        setError(message);
        setLoading(false);
      });
  };

  const socialLogin = async (provider: Provider) => {
    try {
      setLoading(true);
      const providerObj =
        provider === "facebook"
          ? new firebase.auth.FacebookAuthProvider()
          : provider === "google"
          ? new firebase.auth.GoogleAuthProvider()
          : null;
      if (!providerObj) {
        setLoading(false);
        return;
      }
      const response = await auth.signInWithPopup(providerObj);
      if (!response) {
        setError("Something went wrong");
        setLoading(false);
        return;
      }

      const onSignup = functions.httpsCallable("onSignup");

      const data = await onSignup({ username: response.user?.displayName });

      setLoading(false);
      return data;
    } catch (err) {
      const { message } = err as { message: string };
      setError(message);
      setLoading(false);
    }
  };

  return {
    signup,
    signout,
    signin,
    error,
    loading,
    resetPassword,
    successMsg,
    socialLogin,
  };
};
