import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  forwardRef,
} from "react";
import { button } from "./Button.css";

interface BaseProps {
  variant?: "filter" | "submit" | "delete";
  active?: boolean;
}

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    BaseProps {
  as?: "button";
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseProps {
  as: "input";
}

type Props = ButtonProps | InputProps;

const Button = forwardRef<HTMLButtonElement | HTMLInputElement, Props>(
  (
    {
      children,
      variant = "filter",
      active,
      className,
      as = "button",
      ...props
    },
    ref
  ) => {
    const buttonClasses = button({ variant, active });

    if (as === "input") {
      return (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type="submit"
          className={buttonClasses}
          value={children as string}
          {...(props as InputProps)}
        />
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={buttonClasses}
        data-active={active}
        {...(props as ButtonProps)}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
