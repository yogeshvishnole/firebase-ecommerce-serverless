import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input";
import { useAuthenticate } from "../../hooks";
import { useModalContext } from "../../state/modal-context";
import { SignupData } from "../../types";

interface Props {}

const ResetPassword: React.FC<Props> = () => {
  const { resetPassword, successMsg, loading, error } = useAuthenticate();
  const { register, errors, handleSubmit } = useForm<
    Omit<SignupData, "username" | "password">
  >();
  const { setModalType } = useModalContext();

  const handleResetPassword = handleSubmit(async (data) => resetPassword(data));

  return (
    <>
      <div className="backdrop" onClick={() => setModalType("close")}></div>
      <div className="modal modal--auth-form">
        <div className="modal-close" onClick={() => setModalType("close")}>
          &times;
        </div>
        <h3 className="header--center paragraph--center paragraph--orange ">
          Enter your email to reset your password
        </h3>
        <form className="form" onSubmit={handleResetPassword}>
          <Input
            name="email"
            placeholder="Your email"
            error={errors.email?.message}
            ref={register({
              required: "Email is required.",
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
        {successMsg && (
          <p className="paragraph--success paragraph--small">{successMsg}</p>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
