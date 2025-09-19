

type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

function Button({ onClick, children, className }: ButtonProps) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;