import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Provider } from "../../types";
import { firebase } from "../../firebase/config";
import Button from "../Button";
import { useModalContext } from "../../state/modal-context";

interface Props {
  socialLogin: (
    provider: Provider
  ) => Promise<firebase.functions.HttpsCallableResult | undefined>;
  loading: boolean;
}

const SocialMediaLogin: React.FC<Props> = ({ socialLogin, loading }) => {
  const { setModalType } = useModalContext();

  const handleSocialLogin = async (provider: Provider) => {
    const response = await socialLogin(provider);
    if (response) setModalType("close");
  };

  return (
    <div className="social">
      <Button
        className="social-btn social-btn--fb"
        width="100%"
        height="3rem"
        onClick={() => handleSocialLogin("facebook")}
        disabled={loading}
      >
        <FontAwesomeIcon icon={["fab", "facebook-f"]} />
        <span>Log in with Facebook</span>
      </Button>
      <Button
        className="social-btn social-btn--google"
        width="100%"
        height="3rem"
        onClick={() => handleSocialLogin("google")}
        disabled={loading}
      >
        <FontAwesomeIcon icon={["fab", "google"]} />
        <span>Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocialMediaLogin;
