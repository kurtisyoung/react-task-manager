import { type ButtonHTMLAttributes, type InputHTMLAttributes } from "react";
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

const Button = ({
  children,
  variant = "filter",
  active,
  className,
  as = "button",
  ...props
}: Props) => {
  const buttonClasses = button({ variant, active });

  if (as === "input") {
    return (
      <input
        type="submit"
        className={buttonClasses}
        value={children as string}
        {...(props as InputProps)}
      />
    );
  }

  return (
    <button
      className={buttonClasses}
      data-active={active}
      {...(props as ButtonProps)}
    >
      {children}
    </button>
  );
};

export default Button;
