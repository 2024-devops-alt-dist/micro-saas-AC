

type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
};

function Button({ onClick, children, disabled, className, type = "button" }: ButtonProps) {
  return (
    <button type={type} className={` ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;