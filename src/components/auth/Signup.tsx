import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input";
import { useAuthenticate } from "../../hooks";
import { useModalContext } from "../../state/modal-context";
import { SignupData } from "../../types";
import SocialMediaLogin from "./SocialMediaLogin";

interface Props {}

const Signup: React.FC<Props> = () => {
  const { signup, loading, error, socialLogin } = useAuthenticate();
  const { register, errors, handleSubmit } = useForm<SignupData>();
  const { setModalType } = useModalContext();

  const handleSignup = handleSubmit(async (data) => {
    const response = await signup(data);
    if (response) setModalType("close");
  });
  return (
    <>
      <div className="backdrop" onClick={() => setModalType("close")}></div>
      <div className="modal modal--auth-form">
        <div className="modal-close" onClick={() => setModalType("close")}>
          &times;
        </div>
        <h3 className="header--center paragraph--center paragraph--orange ">
          Signup to YoShop
        </h3>
        <SocialMediaLogin socialLogin={socialLogin} loading={loading} />
        <hr />
        <p className="paragraph--center paragraph--focus paragraph--small">
          or Sign up with email
        </p>
        <form className="form" onSubmit={handleSignup}>
          <Input
            label="Username"
            name="username"
            error={errors.username?.message}
            placeholder="Your username"
            ref={register({
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be atleast 3 characters.",
              },
              maxLength: {
                value: 20,
                message: "Username must not be greater than 20 characters.",
              },
            })}
          />

          <Input
            name="email"
            label="Email"
            placeholder="Your email"
            error={errors.email?.message}
            ref={register({
              required: "Email is required.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email is in wrong format.",
              },
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
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters.",
              },
              maxLength: {
                value: 50,
                message: "Password must not be greater thant 50 characters.",
              },
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
          Already have an account ?{" "}
          <span
            className="paragraph--orange paragraph--link"
            onClick={() => setModalType("signin")}
          >
            sign in{" "}
          </span>
          instead.
        </p>
      </div>
    </>
  );
};

export default Signup;
