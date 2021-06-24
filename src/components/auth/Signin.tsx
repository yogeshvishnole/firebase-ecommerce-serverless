import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Button from "../Button";
import Input from "../Input";
import { useAuthenticate } from "../../hooks";
import { useModalContext } from "../../state/modal-context";
import { SignupData } from "../../types";
import SocialMediaLogin from "./SocialMediaLogin";

interface Props {}

const Signin: React.FC<Props> = () => {
  const { signin, loading, error, socialLogin } = useAuthenticate();
  const { register, errors, handleSubmit } = useForm<
    Omit<SignupData, "username">
  >();
  const history = useHistory();
  const { setModalType } = useModalContext();

  const handleSignin = handleSubmit(async (data) => {
    const response = await signin(data);
    if (response) setModalType("close");
  });

  return (
    <>
      <div
        className="backdrop"
        onClick={() => {
          setModalType("close");
          history.replace("/", undefined);
        }}
      ></div>
      <div className="modal modal--auth-form">
        <div
          className="modal-close"
          onClick={() => {
            setModalType("close");
            history.replace("/", undefined);
          }}
        >
          &times;
        </div>
        <h3 className="header--center paragraph--center paragraph--orange ">
          Signin to YoShop
        </h3>
        <SocialMediaLogin socialLogin={socialLogin} loading={loading} />
        <hr />
        <p className="paragraph--center paragraph--focus paragraph--small">
          or Sign up with email
        </p>
        <form className="form" onSubmit={handleSignin}>
          <Input
            name="email"
            label="Email"
            placeholder="Your email"
            error={errors.email?.message}
            ref={register({
              required: "Email is required.",
            })}
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Your password"
            error={errors.password?.message}
            ref={register({
              required: "Password is required.",
            })}
          />

          <Button
            loading={loading}
            type="submit"
            width="100%"
            style={{ margin: "0.5rem 0rem" }}
          >
            Submit
          </Button>
          {error && <p className="paragraph paragraph--error">{error}</p>}
        </form>
        <p className="paragraph paragraph--focus paragraph--small">
          Don't have an account yet?{" "}
          <span
            className="paragraph--orange paragraph--link"
            onClick={() => setModalType("signup")}
          >
            sign up{" "}
          </span>
          instead.
        </p>
        <p className="paragraph paragraph--focus paragraph--small">
          Forgot your password? Click{" "}
          <span
            className="paragraph--orange paragraph--link"
            onClick={() => setModalType("reset_password")}
          >
            here
          </span>
          `
        </p>
      </div>
    </>
  );
};

export default Signin;
