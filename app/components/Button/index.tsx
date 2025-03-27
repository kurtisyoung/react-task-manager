import { button } from "./Button.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "filter" | "submit" | "delete";
};

export default function Button({
  children,
  variant = "filter",
  ...props
}: ButtonProps) {
  return (
    <button className={button({ variant })} {...props}>
      {children}
    </button>
  );
}
