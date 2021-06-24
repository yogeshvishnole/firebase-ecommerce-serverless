import { ButtonHTMLAttributes, forwardRef, Ref } from "react";
import Spinner from "./Spinner";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  height?: string;
  width?: string;
  loading?: boolean;
  spinnerHeight?: number;
  spinnerWidth?: number;
  spinnerColor?: string;
}

const Button = forwardRef(
  (
    {
      children,
      loading,
      className,
      style,
      height = "2.7rem",
      width = "9rem",
      spinnerColor,
      spinnerHeight,
      spinnerWidth,
      ...props
    }: Props,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        className={`btn ${className}`}
        ref={ref}
        style={{
          cursor: loading || props.disabled ? "not-allowed" : undefined,
          height,
          width,
          ...style,
        }}
        {...props}
      >
        {loading ? (
          <Spinner
            color={spinnerColor}
            height={spinnerHeight}
            width={spinnerWidth}
          />
        ) : (
          children
        )}
      </button>
    );
  }
);

export default Button;
